import { fail, type Actions, type RequestEvent } from '@sveltejs/kit';
import { NOTION_DBS } from './constants';
import { t } from './i18n';
import { sendTransactionalEmail } from './mail/sendEmail.server';
import { notion } from './notion.server';

type FormFields = {
  name: string;
  email: string;
  message: string;
  position?: string;
  budget?: string;
  attachments?: string;
};

const handleContactForm =
  (handleSaveToDatabase: (data: FormFields) => Promise<void>) => async (event: RequestEvent) => {
    const data = await event.request.formData();

    const fields = Object.fromEntries(data.entries()) as FormFields;
    const { name, email, message } = fields;

    if (!name || !email || !message) {
      return fail(400, {
        error: {
          type: 'fields',
          fields: {
            name: !name,
            email: !email,
            message: !message
          }
        }
      });
    }

    try {
      await handleSaveToDatabase(fields);
    } catch (error) {
      return fail(422, {
        error: {
          type: 'notion'
        }
      });
    }

    try {
      const subject = t('form.subject');
      await sendTransactionalEmail({ name, email, subject });
    } catch (error) {
      return fail(422, {
        error: {
          type: 'email'
        }
      });
    }

    return {
      success: true
    };
  };

export const actions: Actions = {
  quote: handleContactForm(async ({ name, email, budget, message, attachments }) => {
    await notion.pages.create({
      parent: { database_id: NOTION_DBS.leads },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Budget: { select: { name: budget || 'n/a' } },
        Message: { rich_text: [{ text: { content: message || '' } }] },
        Status: { select: { name: 'To triage' } },
        Attachments: {
          files: (attachments || '')
            .split(',')
            .filter((url) => url && url.startsWith('https'))
            .map((url) => {
              const parts = url.split('/');
              return { name: parts[parts.length - 1], external: { url } };
            })
        }
      }
    });
  }),
  career: handleContactForm(async ({ name, email, position, message, attachments }) => {
    await notion.pages.create({
      parent: { database_id: NOTION_DBS.candidates },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Position: { select: { name: position || 'n/a' } },
        Message: { rich_text: [{ text: { content: message || '' } }] },
        Attachments: {
          files: (attachments || '')
            .split(',')
            .filter((url) => url && url.startsWith('https'))
            .map((url) => {
              const parts = url.split('/');
              return { name: parts[parts.length - 1], external: { url } };
            })
        }
      }
    });
  }),
  contact: handleContactForm(async ({ name, email, message }) => {
    await notion.pages.create({
      parent: { database_id: NOTION_DBS.contacts },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Message: { rich_text: [{ text: { content: message || '' } }] }
      }
    });
  })
};
