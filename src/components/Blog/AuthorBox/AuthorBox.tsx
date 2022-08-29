import React, { ReactNode } from 'react'

import Image from '../../PrismicImage'
import { Author } from '../types'
import * as S from './styled'

const AuthorBox: React.FC<{
  author: Author
  compact?: boolean
  children?: ReactNode
}> = ({ author, compact = false, children }) => {
  return (
    <S.Wrap>
      {author.profile_pic && (
        <S.ImageBox size={compact ? 'small' : 'regular'}>
          <Image
            image={author.profile_pic.gatsbyImageData}
            src={author.profile_pic.url}
            alt={author.profile_pic.alt}
          />
        </S.ImageBox>
      )}

      <div>
        {compact ? (
          <>
            <S.Label as="p" color="secondary">
              {author.name}
              {children}
            </S.Label>
          </>
        ) : (
          <>
            <S.Text>{author.name}</S.Text>
            <S.Text color="secondary">{author.position}</S.Text>
          </>
        )}
      </div>
    </S.Wrap>
  )
}

export default AuthorBox
