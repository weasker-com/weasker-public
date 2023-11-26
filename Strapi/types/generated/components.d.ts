import type { Schema, Attribute } from '@strapi/strapi';

export interface Category1Question extends Schema.Component {
  collectionName: 'components_category_1_questions';
  info: {
    displayName: 'question';
    description: '';
  };
  attributes: {
    shortQuestion: Attribute.String;
    mediumQuestion: Attribute.String;
    longQuestion: Attribute.Text;
    number: Attribute.Integer;
    question: Attribute.Relation<
      'category-1.question',
      'oneToOne',
      'api::question.question'
    >;
  };
}

export interface Category1RichText extends Schema.Component {
  collectionName: 'components_category_1_rich_texts';
  info: {
    displayName: 'Rich text';
    description: '';
  };
  attributes: {
    Answer: Attribute.Blocks;
    question: Attribute.Relation<
      'category-1.rich-text',
      'oneToOne',
      'api::question.question'
    >;
  };
}

export interface Category1Slug extends Schema.Component {
  collectionName: 'components_category_1_slugs';
  info: {
    displayName: 'slug';
    icon: 'link';
    description: '';
  };
  attributes: {
    slug: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'category-1.question': Category1Question;
      'category-1.rich-text': Category1RichText;
      'category-1.slug': Category1Slug;
    }
  }
}
