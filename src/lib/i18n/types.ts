export const TranslationKeys = [
  'expand',
  'related-project.title',
  'related-project.description',
  'related-project.link',
  'author-page',
  'related-posts.title',
  'blog.title',
  'blog.load-more',
  'blog.no-results',
  'project.published-in',
  'recognitions',
  'services',
  'deliverables',
  'links',
  'project.team',
  'handbook',
  'on-this-page',
  'close',
  'filters',
  'clear-all',
  'view-project',
  'member.projects.title',
  'member.projects.subtitle',
  'member.posts.title',
  'member.posts.subtitle',
  'member.about',
  'prefooter.title.line1',
  'prefooter.title.line2',
  'prefooter.description',
  'form.subject',
  'contact.type.quote.title',
  'contact.type.quote.description',
  'contact.type.position.title',
  'contact.type.position.description',
  'contact.type.contact.title',
  'contact.type.contact.description',
  'contact.position.default',
  'contact.feedback.success.title',
  'contact.feedback.success.description',
  'contact.feedback.error.notion.title',
  'contact.feedback.error.notion.description',
  'contact.feedback.error.email.title',
  'contact.feedback.error.email.description',
  'contact.type.title',
  'contact.type.description',
  'contact.label.name',
  'contact.label.email',
  'contact.label.budget',
  'contact.label.position',
  'contact.label.message',
  'contact.footer.title',
  'contact.footer.email',
  'contact.submit',
  'blog.pre-footer.title',
  'blog.pre-footer.cta',
  'contact.feedback.error.title',
  'contact.feedback.error.description',
  'contact.label.attachment.quote',
  'contact.label.attachment.position',
  'seo.title',
  'seo.description',
  'projects.title',
  'team.former',
  'careers.footer.title',
  'careers.footer.email',
  'careers.footer.description',
  'tictactoe.play',
  'tictactoe.restart',
  'tictactoe.close',
  'tictactoe.title',
  'tictactoe.subtitle',
  'tictactoe.win',
  'tictactoe.lose',
  'tictactoe.draw',
  'tictactoe.your-turn',
  'tictactoe.wait',
  'handbook.draft.title',
  'handbook.draft.description',
  'draw-segg.title',
  'draw-segg.description',
  'draw-segg.cta',
  'draw-segg.clipboard.feedback',
  'reel.play',
  'file.upload.error.title',
  'file.upload.error.description'
] as const;

export type TranslationKey = (typeof TranslationKeys)[number];
export function isTranslationKey(key: string | TranslationKey): key is TranslationKey {
  return TranslationKeys.includes(key as TranslationKey);
}