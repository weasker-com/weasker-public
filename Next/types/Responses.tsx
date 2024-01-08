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
            image: { url: string; filename: string } | null;
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
            image: { url: string; filename: string } | null;
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
            image: { url: string; filename: string } | null;
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
            filename: string;
          } | null;
          keywords: string[] | [];
        };
      }[];
    };
    BadgeUsers: {
      docs: {
        userName: string;
        userBadges: {
          bio: string;
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
            filename: string;
          } | null;
        };
      }[];
    };
    BadgeQuestions: {
      docs:
        | {
            seo: {
              slug: string;
              image: { url: string; filename: string } | null;
            };
            name: string;
            questions:
              | {
                  question: {
                    answers: { user: { userName: string } }[];
                    shortQuestion: string;
                    mediumQuestion: string;
                    longQuestion: string;
                    index: number;
                    seo: {
                      slug: string;
                      image: {
                        url: string | null;
                        filename: string;
                      } | null;
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
                filename: string;
                url: string;
              } | null;
            };
          };
          seo: {
            title: string | null;
            description: string | null;
            image: { url: string; filename: string } | null;
          };
        }
      ];
    };
    InterviewUser: {
      docs: [
        {
          userName: string;
          seo: {
            image: {
              filename: string;
              url: string;
            } | null;
          };
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
                url: string;
                filename: string;
              } | null;
            };
          };
          seo: {
            image: { url: string; filename: string } | null;
          };
          questions: {
            question: {
              index: number;
              shortQuestion: string;
              mediumQuestion: string;
              longQuestion: string;
              seo: {
                slug: string;
                image: { url: string; filename: string } | null;
              };
              answers: {
                user: {
                  userName: string;
                  seo: {
                    slug: string;
                    image: { url: string; filename: string };
                  };
                };
                answer: {
                  richText_html: string;
                  images:
                    | {
                        image: { url: string; filename: string };
                      }[]
                    | [];
                  video: { url: string; filename: string } | null;
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
            filename: string;
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
                filename: string;
                url: string;
              } | null;
            };
          };
          seo: {
            image: { url: string; filename: string } | null;
          };
          questions: {
            question: {
              shortQuestion: string;
              longQuestion: string;
              answers: { user: { userName: string; seo: { slug: string } } }[];
              seo: {
                title: string | null;
                description: string | null;
                image: { url: string; filename: string } | null;
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
                filename: string;
              } | null;
            };
          };
          seo: {
            image: {
              url: string;
              filename: string;
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
                  filename: string;
                  url: string;
                } | null;
              };
              answers: {
                user: {
                  userName: string;
                  seo: {
                    slug: string;
                    image: { url: string; filename: string };
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
                        image: { url: string; filename: string };
                      }[]
                    | [];
                  video: { url: string; filename: string } | null;
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
            filename: string;
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
                filename: string;
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
            filename: string;
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
              excerpt: string;
              image: {
                filename: string;
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
          excerpt: string | null;
          image: {
            filename: string;
            url: string;
          } | null;
        };
        badge: {
          pluralName: string;
          singularName: string;
          seo: {
            slug: string;
          };
        };
        questions: { question: { shortQuestion: string } }[];
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
        name: string;
        seo: {
          slug: string;
          excerpt: string;
          image: { url: string; filename: string }[];
        };
        badge: {
          singularName: string;
          pluralName: string;
          seo: {
            slug: string;
            image: { url: string; filename: string } | null;
          };
        };
        questions: {
          question: {
            seo: {
              slug: string;
            };
            shortQuestion: string;
            mediumQuestion: string;
            answers: {
              user: {
                userName: string;
                seo: {
                  slug: string;
                  image: { url: string; filename: string } | null;
                };
              };
              answer: {
                richText_html: string;
                video: { url: string; filename: string } | null;
                images: { image: { url: string; filename: string } }[];
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
        seo: { slug: string; image: { url: string; filename: string } | null };
      }[];
    };
    Users: {
      docs: {
        userName: string;
        seo: { slug: string; image: { url: string; filename: string } | null };
      }[];
    };
  };
};
