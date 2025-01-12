export const ARTICLE_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export type ArticleStatus =
  (typeof ARTICLE_STATUSES)[keyof typeof ARTICLE_STATUSES]

export const ANNOUNCEMENT_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export type AnnouncementStatus =
  (typeof ANNOUNCEMENT_STATUSES)[keyof typeof ANNOUNCEMENT_STATUSES]

export const LANDING_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export type LandingStatus =
  (typeof LANDING_STATUSES)[keyof typeof LANDING_STATUSES]
