export type pageRes = {
  data: {
    Pages: {
      docs: [
        {
          name: string;
          richText_html: string | null;
          seo: {
            title: string | null;
            description: string | null;
            excerpt: string | null;
            image: string | null;
            keywords: string[] | [];
          };
        }
      ];
    };
  };
};

export type pageSeoRes = {
  data: {
    Pages: {
      docs: [
        {
          name: string;
          seo: {
            title: string | null;
            description: string | null;
            image: string | null;
            keywords: string[] | [];
          };
        }
      ];
    };
  };
};

export type badgeSeoRes = {
  data: {
    Badges: {
      docs: [
        {
          singularName: string;
          pluralName: string;
          seo: {
            title: string | null;
            description: string | null;
            image: string | null;
            keywords: string[] | [];
          };
        }
      ];
    };
    BadgeUsers: {
      docs: {
        id: string;
      }[];
    };
  };
};

export type badgePageRes = {
  data: {
    Badges: {
      docs: {
        singularName: string;
        pluralName: string;
        seo: {
          excerpt: string | null;
          image: {
            url: string | null;
            alt: string | null;
          } | null;
          keywords: string[] | [];
        };
      }[];
    };
    BadgeUsers: {
      docs: {
        userName: string;
        userBadges: {
          services: {
            name: string;
            url: string;
          }[];
          badge: {
            seo: {
              slug: string;
            };
          };
        }[];
        seo: {
          slug: string;
          image: {
            url: string | null;
            alt: string | null;
          } | null;
        };
      }[];
    };
    BadgeQuestions: {
      docs:
        | {
            seo: { slug: string };
            name: string;
            questions:
              | {
                  question: {
                    shortQuestion: string;
                    index: number;
                    seo: {
                      slug: string;
                      image: {
                        url: string | null;
                        alt: string | null;
                      };
                    };
                  };
                }[];
          }[]
        | [];
    };
  };
};

export type interviewSeoRes = {
  data: {
    BadgeInterview: {
      docs: [
        {
          name: string;
          badge: {
            singularName: string;
            pluralName: string;
            seo: {
              image: {
                url: string | null;
              } | null;
            };
          };
          seo: {
            title: string | null;
            description: string | null;
            image: string | null;
          };
        }
      ];
    };
    InterviewUser: {
      docs: [
        {
          userName: string;
        }
      ];
    };
  };
};

export type interviewPageRes = {
  data: {
    BadgeInterview: {
      docs: [
        {
          name: string;
          badge: {
            singularName: string;
            pluralName: string;
            seo: {
              image: {
                url: string | null;
              } | null;
            };
          };
          seo: {
            image: string | null;
          };
          questions: {
            question: {
              index: number;
              shortQuestion: string;
              mediumQuestion: string;
              longQuestion: string;
              seo: { slug: string };
              answers: {
                user: {
                  userName: string;
                  seo: {
                    slug: string;
                    image: { url: string };
                  };
                };
                answer: {
                  richText_html: string;
                  images:
                    | {
                        image: { url: string };
                      }[]
                    | [];
                  video: { url: string } | null;
                };
              }[];
            };
          }[];
        }
      ];
    };
    InterviewUser: {
      docs: {
        userName: string;
        seo: {
          slug: string;
          image: {
            url: string;
          } | null;
        };
        userBadges: {
          services:
            | {
                name: string;
                url: string;
              }[]
            | [];
          bio: string;
          badge: {
            singularName: string;
            seo: {
              slug: string;
            };
          };
        }[];
      }[];
    };
  };
};

export type questionSeoRes = {
  data: {
    BadgeInterview: {
      docs: [
        {
          name: string;
          badge: {
            singularName: string;
            pluralName: string;
            seo: {
              image: {
                url: string;
              } | null;
            };
          };
          seo: {
            image: { url: string } | null;
          };
          questions: {
            question: {
              shortQuestion: string;
              longQuestion: string;
              answers: { user: { userName: string; seo: { slug: string } } }[];
              seo: {
                title: string | null;
                description: string | null;
                image: { url: string } | null;
                slug: string;
              };
            };
          }[];
        }
      ];
    };
  };
};

export type questionPageRes = {
  data: {
    BadgeInterview: {
      docs: [
        {
          name: string;
          badge: {
            singularName: string;
            pluralName: string;
            seo: {
              image: {
                url: string;
              } | null;
            };
          };
          seo: {
            image: {
              url: string;
            } | null;
          };
          questions: {
            question: {
              index: number;
              shortQuestion: string;
              mediumQuestion: string;
              longQuestion: string;
              seo: {
                slug: string;
                image: {
                  url: string;
                } | null;
              };
              answers: {
                user: {
                  userName: string;
                  seo: {
                    slug: string;
                    image: { url: string };
                  };
                  userBadges: {
                    badge: { seo: { slug: string } };
                    services: { name: string; url: string }[];
                  }[];
                };
                answer: {
                  richText_html: string;
                  images:
                    | {
                        image: { url: string };
                      }[]
                    | [];
                  video: { url: string } | null;
                };
              }[];
            };
          }[];
        }
      ];
    };
  };
};

export type userSeoRes = {
  data: {
    Users: {
      docs: {
        userName: string;
        seo: {
          title: string | null;
          description: string | null;
          excerpt: string | null;
          image: {
            url: string;
          } | null;
        };
        userBadges: {
          bio: string;
          services: {
            name: string;
            url: string;
          }[];
          badge: {
            pluralName: string;
            singularName: string;
            seo: {
              slug: string;
              image: {
                url: string;
              } | null;
            };
          };
        }[];
      }[];
    };
  };
};

export type userPageRes = {
  data: {
    Users: {
      docs: {
        userName: string;
        seo: {
          title: string | null;
          description: string | null;
          excerpt: string | null;
          image: {
            url: string;
          } | null;
        };
        userBadges: {
          bio: string;
          services: {
            name: string;
            url: string;
          }[];
          badge: {
            pluralName: string;
            singularName: string;
            seo: {
              slug: string;
              image: {
                url: string;
              } | null;
            };
          };
        }[];
      }[];
    };
    UserInterviews: {
      docs: {
        name: string;
        seo: {
          slug: string;
          image: {
            url: string;
          } | null;
        };
        badge: {
          seo: {
            slug: string;
          };
        };
      }[];
    };
  };
};

export type siteMapRes = {
  data: {
    Interviews: {
      docs: {
        seo: {
          slug: string;
        };
        updatedAt: string;
        badge: {
          seo: {
            slug: string;
          };
        };
        questions: {
          question: {
            answers: {
              user: {
                seo: {
                  slug: string;
                };
              };
            }[];
            seo: {
              slug: string;
            };
          };
        }[];
      }[];
    };
    Users: {
      docs: {
        seo: {
          slug: string;
        };
        updatedAt: string;
      }[];
    };
    Badges: {
      docs: {
        seo: {
          slug: string;
        };
        updatedAt: string;
      }[];
    };
    Pages: {
      docs: {
        seo: {
          slug: string;
        };
        updatedAt: string;
      }[];
    };
  };
};

export type homePageRes = {
  data: {
    Interviews: {
      docs: {
        seo: {
          slug: string;
        };
        badge: {
          singularName: string;
          pluralName: string;
          seo: {
            slug: string;
            image: { url: string } | null;
          };
        };
        questions: {
          question: {
            seo: {
              slug: string;
            };
            shortQuestion: string;
            answers: {
              user: {
                userName: string;
                seo: {
                  slug: string;
                  image: { url: string };
                };
              };
              answer: {
                richText_html: string;
                video: { url: string };
                images: { image: { url: string } }[];
              };
            }[];
          };
        }[];
      }[];
    };
    Badges: {
      docs: {
        pluralName: string;
        singularName: string;
        seo: { slug: string; image: { url: string } };
      }[];
    };
    Users: {
      docs: {
        userName: string;
        seo: { slug: string; image: { url: string } };
      }[];
    };
  };
};
