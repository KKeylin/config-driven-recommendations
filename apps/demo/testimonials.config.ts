import type { TestimonialConfig } from 'config-driven-testimonials';

const config: TestimonialConfig = {
  author: {
    name: 'Kostiantyn Keilin',
    title: 'Senior Front-End Engineer',
    linkedinUrl: 'https://www.linkedin.com/in/konstantin-keylin/',
  },
  testimonials: [
    {
      id: '10',
      author: {
        name: 'Preeti Indulkar',
        avatarUrl: '/avatars/preeti-indulkar.jpeg',
        title: 'Managing Consultant',
        currentRole: { title: 'Managing Consultant', company: 'EPAM/First Derivative' },
        linkedinUrl: 'https://www.linkedin.com/in/preeti-indulkar-a50a5866/',
      },
      text: 'I had the pleasure of managing Kostiantyn at EPAM, and my experience working with him has been entirely positive. He consistently fulfilled all responsibilities assigned to him with a high level of quality and professionalism. Kostiantyn provided thoughtful feedback both on project matters and during the technical interviews he conducted. He is always positive, focused, and approachable, with a strong ability to learn new technologies quickly while maintaining a broad technical expertise. Throughout our collaboration, there was not a single instance where he missed a deadline — if he committed to completing something by the end of the day, that\'s exactly when it was done. I can wholeheartedly recommend Kostiantyn as an excellent developer, colleague, and team player.',
      relationship: 'Preeti managed Kostiantyn directly at EPAM',
      date: '2026-02-19',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/preeti-indulkar-a50a5866/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'EPAM/First Derivative', period: '2024–2026', type: 'employment' },
      weight: { level: 'manager', yearsExperience: 21 },
    },
    {
      id: '9',
      author: {
        name: 'Manoj Sharma',
        avatarUrl: '/avatars/manoj-sharma.jpeg',
        title: 'Frontend Engineering Lead',
        currentRole: { title: 'Frontend Engineering Lead', company: 'EPAM' },
        linkedinUrl: 'https://www.linkedin.com/in/manoj-sharma-32967a68/',
      },
      text: 'I conducted an internal interview with Konstantin for a project, and he left a very positive impression. He comes across as a knowledgeable specialist with a solid technical background and a deep understanding of software development. At the same time, he\'s an open and friendly person with extensive hands-on experience and a broad view of modern technologies. The conversation flowed naturally, and we were on the same wavelength throughout. I\'d be glad to have an opportunity to work with him on a project in the future.',
      relationship: 'Kostiantyn interviewed Manoj as a React/JS expert at EPAM',
      date: '2026-02-11',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/manoj-sharma-32967a68/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'EPAM', period: '2025', type: 'employment' },
      weight: { level: 'colleague', yearsExperience: 8 },
    },
    {
      id: '8',
      author: {
        name: 'Pavlo Vynohradov',
        avatarUrl: '/avatars/pavlo-vynohradov.jpeg',
        title: 'Head of Unity XR Department / Team Lead',
        currentRole: { title: 'Software Engineer', company: 'Sportradar' },
        linkedinUrl: 'https://www.linkedin.com/in/pavlo-vynohradov/',
      },
      text: 'I had the great pleasure of working with Konstantin Keylin in the same company, and I can confidently say that he is an outstanding professional and an exceptional colleague.\n' +
        '\n' +
        'Konstantin combines deep technical expertise with an impressive ability to solve complex problems quickly and efficiently. What sets him apart is not only his knowledge, but also his positive attitude, reliability, and willingness to help others. He consistently earned respect and trust from everyone around him – both managers and teammates – because of his professionalism and strong work ethic.\n' +
        '\n' +
        'Whenever a challenging task appeared, Konstantin was the one people relied on to handle it with confidence and precision. His proactive mindset, clear communication, and ability to see the bigger picture made him a key contributor to our success.\n' +
        '\n' +
        'On top of that, he is a genuinely great person to work with – approachable, collaborative, and always bringing positive energy to the team.\n' +
        '\n' +
        'I can wholeheartedly recommend Konstantin as a top-level expert and an invaluable team player. Any company would be lucky to have him.\n',
      relationship: 'Pavlo worked with Kostiantyn on different teams',
      date: '2025-08-26',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/pavlo-vynohradov/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Litslink', period: '2018–2020', type: 'employment' },
      weight: { level: 'colleague' },
    },
    {
      id: '7',
      author: {
        name: 'Jeff Qi',
        avatarUrl: '/avatars/jeff-qi.jpeg',
        title: 'Sr. Technical Systems Analyst',
        currentRole: { title: 'Sr. Technical Systems Analyst', company: 'RBC Capital Markets' },
        linkedinUrl: 'https://www.linkedin.com/in/jeffqi/',
      },
      text: 'I had the pleasure of working closely with Kostiantyn on the AiQ project at RBC, where he served as the lead frontend developer. From the very beginning, it was clear that Kostiantyn brought not only a deep technical expertise, but also a genuine passion for building thoughtful, user-centric solutions.\n' +
        '\n' +
        'Our collaboration between frontend and backend was seamless — a rare and valuable alignment that made even the most complex tasks feel smooth and efficient. Kostiantyn consistently demonstrated initiative and creativity in solving architectural challenges, often proactively suggesting improvements that benefitted the entire system.\n' +
        '\n' +
        'He has an exceptional ability to think holistically, ensuring that the frontend architecture was not only elegant but also scalable and easy to integrate with backend services. His attention to detail, combined with a pragmatic mindset, made him a key contributor to the overall success of the platform.\n' +
        '\n' +
        'Beyond his technical skills, Kostiantyn is simply great to work with — reliable, communicative, and collaborative. Working with him felt like a true partnership, and I would welcome the opportunity to collaborate again on any future project.',
      relationship: 'Jeff worked with Kostiantyn on the same team at RBC',
      date: '2025-07-31',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/jeffqi/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'RBC', period: '2022–2024', type: 'contract' },
      weight: { level: 'colleague', yearsExperience:  18},
    },
    {
      id: '6',
      author: {
        name: 'Ivan Kvitka',
        avatarUrl: '/avatars/ivan-kvitka.jpeg',
        title: 'Frontend Developer',
        currentRole: { title: 'Software Engineer', company: 'Trinetix' },
        linkedinUrl: 'https://www.linkedin.com/in/ivan-kvitka-78a293175/',
      },
      text: 'I had a great experience working with Konstantin. One thing I wanted to notice is that he is a professional in the frontend area, good problem solver and a very hard-working person. He knows how to prioritize tasks to make all the things work together in time.',
      relationship: 'Ivan worked with Kostiantyn on the same team',
      date: '2021-11-17',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/ivan-kvitka-78a293175/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Trinetix', period: '2020', type: 'employment' },
      weight: { level: 'colleague' },
    },
    {
      id: '5',
      author: {
        name: 'Maksym Sviechnikov',
        title: 'Senior Software Engineer',
        currentRole: { title: 'Senior Software Engineer', company: 'Atolls' },
        linkedinUrl: 'https://www.linkedin.com/in/sviechnikov/',
      },
      text: 'We worked with Konstantin on similar projects at Litslink. During this time, he has established himself as a proactive developer, rapidly growing, taking responsibility, and leading progress independently (in the Front End part). He had grown significantly as a software engineer within a year, and I hope to meet him on the same project again.',
      relationship: 'Maksym was senior to Kostiantyn at Litslink',
      date: '2021-11-17',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/sviechnikov/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Litslink', period: '2018-2020', type: 'employment' },
      weight: { level: 'lead' },
    },
    {
      id: '4',
      author: {
        name: 'Kalpesh Patel',
        avatarUrl: '/avatars/kalpesh-patel.jpeg',
        title: 'Software Developer',
        currentRole: { title: 'Software Developer', company: 'Bosch' },
        linkedinUrl: 'https://www.linkedin.com/in/kalpesh-b-patel/',
      },
      text: 'I got a chance to work with Konstantin at Avatria. Konstantin helped me a lot when I joined the frontend team. He is smart and humble person with great attitude. He is very knowledgeable in React and ecosystem around React. He is an active participant and always comes up with unique ideas to solve a problem. As a former team member, Konstantin earns my highest recommendation. He would be an asset to any team in a frontend role.',
      relationship: 'Kalpesh worked with Kostiantyn on the same team at Avatria',
      date: '2021-11-13',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/kalpesh-b-patel/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Avatria via Varteq', period: '2021', type: 'contract' },
      weight: { level: 'colleague' },
    },
    {
      id: '3',
      author: {
        name: 'Frank Fineis',
        avatarUrl: '/avatars/frank-fineis.jpeg',
        title: 'Senior Data Scientist',
        currentRole: { title: 'Director of Machine Learning Engineering', company: 'Clearcover' },
        linkedinUrl: 'https://www.linkedin.com/in/frank-fineis-41770277/',
      },
      text: 'Konstantin was very useful while helping to build out v2 of Avatria Convert\'s web interface in React and TypeScript. A quick learner and diligent worker, he was able to adapt to new design patterns and move quickly. I would definitely recommend Konstantin for a future front-end role.',
      relationship: 'Frank worked with Kostiantyn on different teams at Avatria',
      date: '2021-06-10',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/frank-fineis-41770277/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Avatria via Varteq', period: '2020-2021', type: 'contract' },
      weight: { level: 'director' },
    },
    {
      id: '2',
      author: {
        name: 'Andrew Makalish',
        avatarUrl: '/avatars/andrew-makalish.jpeg',
        title: 'PHP Developer',
        currentRole: { title: 'PHP Developer', company: 'MyBeauty' },
        linkedinUrl: 'https://www.linkedin.com/in/makalish/',
      },
      text: 'I know Konstantin as an ambitious person with a high degree of responsibility and good knowlenge skills in frontend. All those qualities were noticeable to me during our participation in projects and competitions both on the same and different teams when we were worked at the Arnit company. His experience and qualities give him a competitive advantage in the labor market, especially in the field of frontend develop.',
      relationship: 'Andrew worked with Kostiantyn on the same team at Arnit',
      date: '2020-09-14',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/makalish/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Arnit', period: '2017–2018', type: 'employment' },
      weight: { level: 'colleague', yearsExperience: 4 },
    },
    {
      id: '1',
      author: {
        name: 'Dmytro Honcharov',
        title: 'Senior Software Engineer',
        currentRole: { title: 'Senior Software Engineer', company: 'GlobalLogic' },
        linkedinUrl: 'https://www.linkedin.com/in/dmytro-honcharov-web/',
      },
      text: 'Konstantin is a frontend developer with great level of responsibility. He always wants to do the hardest feature you have. Also he has good personal characteristics.',
      relationship: 'Dmytro worked with Kostiantyn on different teams at Arnit',
      date: '2019-12-17',
      source: { type: 'linkedin', url: 'https://www.linkedin.com/in/konstantin-keylin/details/recommendations/' },
      recommendationUrl: 'https://www.linkedin.com/in/dmytro-honcharov-web/details/recommendations/?detailScreenTabIndex=1',
      associatedRole: { company: 'Arnit', period: '2017–2018', type: 'employment' },
      weight: { level: 'colleague', yearsExperience: 4 },
    },
  ],
};

export default config;
