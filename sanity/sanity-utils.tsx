import { createClient } from "@sanity/client";
import { groq } from "next-sanity";
import clientConfig from "./config/client-config";
import { User } from "../types/user-type";
import { InterviewPage } from "../types/interviewPage-type";
import { QuestionPage } from "../types/questionPage-type";
import { BadgePage } from "../types/badgePage-type";
import { questionResult } from "../types/questionResult-type";
import { listItem } from "../types/listItem-type";
import { InnerPage } from "../types/innerPage-type";
import { BadgePageMetaData } from "../types/badgePageMeta-type";
import { UserPageMetaData } from "../types/UserPageMeta-type";
import { InnerPageMeta } from "../types/InnerPageMeta-type";
import { InterviewPageMeta } from "../types/InterviewPageMeta-type";
import { QuestionPageMeta } from "../types/questionPageMeta-type";

export async function getInnerPage(pageParam: string): Promise<InnerPage> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "page" && slug.current == $pageParam][0]{
      "name": name,
      "image":image.asset->url,
      "excerpt": excerpt,
        "content": content,
        "seo": {
        "title":seoTitle,
        "description":seoDescription[0].children[0].text,
        "image":openGraphImage.asset->url,
      }
    }`,
    { pageParam }
  );
}

export async function getRecentQuestions(): Promise<questionResult[]> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "badge"]{
      "badge": {
          "name": name,
          "slug": slug.current,
          "image": image.asset->url,
      },
      "interview": *[_type == "interview" && badge._ref == ^._id][0] {
        "interviewQuestion": *[_type=="question" && interview._ref == ^._id][0] {
          "text": shortQuestion,
          "slug": slug.current,
          "image": interview->image.asset->url
        }
      }
    }`,
    {}
  );
}

export async function getUserPage(userParam: string): Promise<User> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "user" && slug.current == $userParam][0]{
      "id": _id,
      "createdAt":_createdAt,
      "name": name,
      "badges": badges[]->{
          "name": name,
          "singularName": singularName, 
          "image": image.asset->url,
           "slug": slug.current,
      },
      "pfp": image.asset->url,
       "services": services[]{
          "name": name,
          "url": link,
      },
        "bio": bio,
        "seoTitle":seoTitle,
        "seoDescription":seoDescription[0].children[0].text,
        "interviews": *[_type == "answer" && user._ref == ^._id]{
           "interview": interview->{
            "name":name,
           "slug":slug.current,
           "image": image.asset->url
      },
      }
    }`,
    { userParam }
  );
}

export async function getInterviewPage(
  userParam: string,
  interviewParam: string
): Promise<InterviewPage> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "interview" &&  slug.current == $interviewParam][0]{
      "interview": {
                  "id": _id,
                  "createdAt":_createdAt,
                  "updatedAt": _updatedAt,
                  "name": name,  
            },
      "user": *[_type == "user" && slug.current == $userParam][0]{
              "name":name,
              "slug": slug.current,
              "userBio":bio,
              "pfp": image.asset->url,
              "badges": badges[]-> {
                    "name": name,
                    "singularName": singularName, 
                    "image": image.asset->url,
                    "slug": slug.current
                  },
              "services": services[] {
                          "name": name,
                          "url": link,
                        },
              },
      "questions": *[_type=="question" && references(^._id)]{
                  "number": number,
                  "question": shortQuestion,
                  "mediumQuestion": question,
                  "slug": slug.current,
                  "answer": *[_type=="answer" && interview->slug.current == $interviewParam &&  user->slug.current == $userParam][0]{
                  answers[questionRef->_id == ^.^._id][0]{
                        "number": questionRef->number,
                        "interviewAnswer": interviewAnswer,
                        "images": images[] {
                        "url":asset->url
                                         },
                      "video": video
               },
                    "seoTitle":seoTitle,
                    "seoDescription":seoDescription,
        },
            },

        "otherUsers": 
        *[_type=="answer" && interview->slug.current == $interviewParam &&  user->slug.current != $userParam][]
              {
                "name": user->name,
                "slug": user->slug.current,
                "pfp": user->image.asset->url,
                "badgeSlug": user->badges[0]->slug.current
              },
          }`,
    { userParam, interviewParam }
  );
}

export async function getQuestionPage(
  badgeParam: string,
  questionParam: string
): Promise<QuestionPage> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "question" && $badgeParam == interview->badge->slug.current && $questionParam == slug.current][0] {
      "questionDetails": {
            "slug": slug,
            "question":question,
            "longQuestion":longQuestion,
            "shortQuestion":shortQuestion,
            "number":number,
            "seoTitle":seoTitle,
            "seoDescription":seoDescription,
                         },
      "interviewDetails":  {
                "name":name,
                "slug": interview->slug.current,
                "image": interview->image.asset->url,
                "ogImage": interview->openGraphImage.asset->url,
                "badge": 
                {
                "name": interview->badge->name,
                "singularName": interview->badge->singularName,
                "slug": interview->badge->slug.current,
                "image": interview->badge->image.asset->url,
                },
                        },
      "answersDetails": *[_type == "answer" && $badgeParam == interview->badge->slug.current && references(^._id)][]{
                "user":{
                  "name": user->name,
                  "slug": user->slug.current,
                  "userBio": user->bio,
                  "pfp": user->image.asset->url,
                  "badges": user->badges[]->
                      {
                        "name": name,
                        "singularName": singularName,
                        "image": image.asset->url,
                        "slug": slug.current
                      },
                  "services": user->services[] 
                      {
                        "name": name,
                        "url": link,
                      },
              },
        "answers": answers[questionRef->slug.current == $questionParam]{
             "interviewAnswer":interviewAnswer,
             "imagesSchema": images[] {
             "url":asset->url
               },
             "number": number,
             "video":video,
        },
            },
        "otherQuestions": *[_type == "question" && $badgeParam == interview->badge->slug.current && $questionParam != slug.current]
        {
              "shortQuestion": shortQuestion,
              "slug": slug.current,
              "image": interview-> image.asset->url
     },
              }`,
    { badgeParam, questionParam }
  );
}

export async function getBadgePage(badgeParam: string): Promise<BadgePage> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "badge" && $badgeParam == slug.current][0] {
      "badgeDetails": {
           "name": name,
           "excerpt": excerpt,
           "singularName": singularName,
           "image": image.asset -> url,
           "slug": slug.current,
                      },
      "usersDetails": *[_type == "user" && references(^._id)][]
           {
          "name": name,
          "image": image.asset -> url,
          "slug": slug.current,
          "services": services[] 
                            {
                              "name": name,
                              "url": link,
                            },
          },
      "questions": *[_type == "question" && interview->badge->slug.current == $badgeParam][]
           {
         "shortQuestion": shortQuestion,
         "slug": slug.current,
         "image": interview->image.asset->url
      }
                    }`,
    { badgeParam }
  );
}

export async function performSearch(searchTerm: string): Promise<listItem[]> {
  const client = createClient(clientConfig);

  const searchWords = searchTerm.split(" ");

  const queries = searchWords.map(
    (word) =>
      `shortQuestion match "${word}" || slug.current match "${word}" || longQuestion match "${word}" || interview->name match "${word}" || interview->slug.current match "${word}" || interview->badge->name match "${word}" || interview->badge->slug.current match "${word}"`
  );

  const query = groq`*[_type == "question" && (${queries.join(" || ")})] {
    "title": shortQuestion,
    "image": interview->image.asset->url,
    "slug": slug.current,
    "badge": interview->badge->{
        "name": name,
        "singularName": singularName,
        "image": image.asset->url,
        "slug": slug.current,
    }
  }`;

  try {
    const results = await client.fetch(query);
    return results;
  } catch (error) {
    console.error("An error occurred during the search:", error);
    return [];
  }
}

export async function getBadgePageMeta(
  badgeParam: string
): Promise<BadgePageMetaData> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "badge" && $badgeParam == slug.current][0] {
      "name": name,
      "excerpt": excerpt,
      "slug": slug.current,
      "singularName": singularName,
      "image": image.asset -> url,
      "seoTitle": seoTitle,
      "seoDescription": seoDescription,
      "ogImage": openGraphImage.asset->url,
      "usersAmount": count(*[_type=="user" && references(^._id)])
               }`,
    { badgeParam }
  );
}

export async function getUserPageMeta(
  userParam: string
): Promise<UserPageMetaData> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "user" && $userParam == slug.current][0] {
      "name": name,
      "slug": slug.current,
      "badgeName": badges[0]->name,
      "badgeSingularName": badges[0]->singularName,
      "image": image.asset -> url,
      "seoTitle": seoTitle,
      "seoDescription": seoDescription,
      "ogImage": openGraphImage.asset->url,
               }`,
    { userParam }
  );
}

export async function getInnerPageMeta(
  pageParam: string
): Promise<InnerPageMeta> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "page" && slug.current == $pageParam][0]{
      "name": name,
      "image":image.asset->url,
      "seoTitle": seoTitle,
      "seoDescription": seoDescription,
      "ogImage": openGraphImage.asset->url,
    }`,
    { pageParam }
  );
}

export async function getInterviewPageMeta(
  userParam: string,
  interviewParam: string
): Promise<InterviewPageMeta> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "interview" &&  slug.current == $interviewParam][0]{
      "interview": {
                  "name": name,  
                  "image":image.asset->url,
                  "seoTitle":seoTitle,
                  "seoDescription":seoDescription,
                  "ogImage": openGraphImage.asset->url,
                  "badgeName": badge->name,
                  "badgeSingularName": badge->singularName,
            },
      "user": *[_type == "user" && slug.current == $userParam][0]{
              "name":name,
              "pfp": image.asset->url,
              "ogImage": openGraphImage.asset->url,
              },
          }`,
    { userParam, interviewParam }
  );
}

export async function getQuestionPageMeta(
  badgeParam: string,
  questionParam: string
): Promise<QuestionPageMeta> {
  return createClient(clientConfig).fetch(
    groq`*[_type == "question" && $badgeParam == interview->badge->slug.current && $questionParam == slug.current][0] {
      "questionDetails": {
            "question":question,
            "longQuestion":longQuestion,
            "shortQuestion":shortQuestion,
            "seoTitle":seoTitle,
            "seoDescription":seoDescription,
                         },
      "interviewDetails":  {
                "ogImage": interview->openGraphImage.asset->url,
                "badge": 
                {
                "name": interview->badge->name,
                "singularName": interview->badge->singularName,
                "ogImage": interview->badge->openGraphImage.asset->url,
                },
              },
      "answersAmount": count(*[_type=="answer" && references(^._id)]),
       "usersDetails": *[_type == "answer" && $badgeParam == interview->badge->slug.current && references(^._id)][]{
                  "name": user->name,
                  "slug": user->slug.current,
                }
            }`,
    { badgeParam, questionParam }
  );
}
