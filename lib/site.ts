// Site-wide identity and copy. Edit here; components read from this file.
// The space before each emoji is a non-breaking space (U+00A0), so an emoji never wraps onto a
// line by itself. Keep that when editing, or type the emoji right after the word.
import {
  IconBackpack,
  IconBallBasketball,
  IconBallFootball,
  IconBallTennis,
  IconBarbell,
  IconBook,
  IconBrandYoutube,
  IconBulb,
  IconBuildingCottage,
  IconHeadphones,
  IconHeartHandshake,
  IconMountain,
  IconMovie,
  IconPalette,
  IconRun,
  IconSchool,
  IconToolsKitchen2,
  type Icon,
} from "@tabler/icons-react";

export const site = {
  name: "Atef Mohamed",
  firstName: "Atef",
  lastName: "Mohamed",
  email: "mohamedatefali18@gmail.com",
  schoolEmail: "atefmo@ad.unc.edu",
  linkedin: "https://www.linkedin.com/in/mohamedatefali/",
  // Not linked anywhere yet; add it back to Contact.tsx and Footer.tsx once there are public repos.
  github: "https://github.com/atefmo-1",
  resume: "/Atef_Mohamed_Resume.pdf",
  portrait: "/portrait.webp",
  location: "Chapel Hill, NC",
  status: "Graduating May 2027. Open to full-time roles.",
  // Hero: what and where I study, then one line on what I do.
  study: {
    majors: ["Computer Science", "Information Science"],
    school: "UNC Chapel Hill '27",
    flag: "🇺🇸",
    scholarship: "Morehead‑Cain Scholar", // non-breaking hyphen
  },
  // The ending rotates (typewriter). It sits at the end so the space reserved for the longest
  // phrase trails off invisibly. The first phrase is what shows without animation.
  positioning: {
    before: "I turn messy workflows into",
    words: ["tools people use.", "prototypes people test.", "AI agents people rely on.", "products people come back to."],
    after: "",
  },
  description:
    "Atef Mohamed works in product and data. Senior at UNC Chapel Hill studying Computer Science and Information Science, and a Morehead-Cain Scholar.",
};

export const about = {
  paragraphs: [
    "I grew up in a small village in Sharqia, Egypt 🇪🇬. Since then: high school in South Africa 🇿🇦, college in the US 🇺🇸, and a lot of being the new person in the room. Being new that often made me good at asking questions, which turns out to be most of product work.",
  ],
  // Newest first. Sources: Morehead-Cain's <1% and full ride are from the resume; "America's first"
  // is from moreheadcain.org; ALA's 47 countries are from africanleadershipacademy.org (which also lists a 4% acceptance rate).
  education: [
    {
      name: "UNC Chapel Hill",
      logo: "unc",
      url: "https://www.unc.edu/",
      detail: "B.A. Computer Science + B.S. Information Science",
      scholarship: {
        name: "Morehead-Cain Scholar",
        url: "https://www.moreheadcain.org/",
        note: "Full ride. America's first merit scholarship.",
      },
      highlight: "<1% of the class picked for Morehead‑Cain", // non-breaking hyphen keeps the name on one line
      location: "Chapel Hill, NC 🇺🇸",
      dates: "May 2027",
    },
    {
      name: "African Leadership Academy",
      logo: "ala",
      url: "https://www.africanleadershipacademy.org/",
      detail: "Pan-African high school, 47 African countries",
      highlight: "<4% acceptance rate",
      location: "Johannesburg, South Africa 🇿🇦",
      dates: "June 2023",
    },
    {
      name: "Samsung Innovation Campus",
      logo: "samsung",
      url: "https://csr.samsung.com/en/newsroom/news/journey-to-a-better-future-helping-the-youth-of-egypt-learn-the-language-of-the",
      detail: "First cohort of its coding and programming scholarship in Egypt",
      // 30 selected out of 7,000+ applicants: 30 / 7,000 = 0.43%, so under 0.5%.
      highlight: "30 of 7,000+ applicants (<0.5%)",
      location: "Egypt 🇪🇬",
      dates: "",
    },
  ] as {
    name: string;
    // Key into lib/logos.ts
    logo?: "unc" | "ala" | "samsung";
    url: string;
    detail: string;
    scholarship?: { name: string; url: string; note: string };
    highlight: string;
    location: string;
    dates: string;
  }[],
  hobbiesTitle: "When I'm not working",
  hobbies: [
    { name: "Basketball", icon: IconBallBasketball, motion: "bounce" },
    { name: "Soccer", icon: IconBallFootball, motion: "roll" },
    { name: "Rock climbing", icon: IconMountain, motion: "climb" },
    { name: "Running", icon: IconRun, motion: "jog" },
    { name: "Gym", icon: IconBarbell, motion: "lift", link: { label: "find me on Hevy @atefmo", url: "https://hevy.com/user/atefmo" } },
    { name: "Squash", icon: IconBallTennis, motion: "swing" },
    { name: "Meal-prepping", icon: IconToolsKitchen2, motion: "stir" },
    { name: "Mentoring", icon: IconHeartHandshake, motion: "lift" },
    { name: "Reading", icon: IconBook, motion: "swing" },
    { name: "Learning", icon: IconBulb, motion: "flicker" },
    { name: "Design", icon: IconPalette, motion: "swing" },
    { name: "Podcasts", icon: IconHeadphones, motion: "bounce" },
    { name: "Documentaries", icon: IconMovie, motion: "flicker" },
    { name: "YouTube", icon: IconBrandYoutube, motion: "bounce" },
  ] as { name: string; icon: Icon; motion: string; link?: { label: string; url: string } }[],
  watchTitle: "Some of my favorite YouTube channels",
  // Avatars load straight from YouTube (small 176px version). If a channel changes its picture,
  // grab the new one from the channel page's share image.
  watchList: [
    { name: "Johnny Harris", handle: "@johnnyharris", url: "https://www.youtube.com/@johnnyharris", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kswBDn49WW5IneVE-5RlKyud5GvdzyQQ5SJQyVvJ4S3pk=s176-c-k-c0x00ffffff-no-rj" },
    { name: "Matthew Encina", handle: "@MatthewEncina", url: "https://www.youtube.com/@MatthewEncina", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_m_lNVx0urtCF3jxwfhbNGm_1rjuqzjlWiw58iZNjIeqQ=s176-c-k-c0x00ffffff-no-rj" },
    { name: "WIRED", handle: "@WIRED", url: "https://www.youtube.com/@WIRED", avatar: "https://yt3.googleusercontent.com/3xLaRljIs8OZjbxyGnMlpHXtzrxY-keMiy9foklNwa9G5wzB2stC4ND56rZfZAuyLKmRLMm2cik=s176-c-k-c0x00ffffff-no-rj" },
    { name: "Morley Kert", handle: "@MorleyKert", url: "https://www.youtube.com/@MorleyKert", avatar: "https://yt3.googleusercontent.com/rUcPlBi8IaRx4R8THfYMi-67x-tZ50Fiqt_ybTXwVoQtKepxgsD94XfF4zkfImU0yeailBF7=s176-c-k-c0x00ffffff-no-rj" },
    { name: "Good Work", handle: "@GoodWorkMB", url: "https://www.youtube.com/@GoodWorkMB", avatar: "https://yt3.googleusercontent.com/Uj7Ky8T7owxiMSQCDLeEaeD-x0rJYkt7e4iqIo8Q8SV3d0yB1UWxo68O4N7Hstmjh-j1J2X3=s176-c-k-c0x00ffffff-no-rj" },
  ],
  // From the Outward Bound course evaluation (WOTE-341, 7/31 to 8/14/2023).
  highlight: {
    label: "Best two weeks outdoors",
    title: "Outward Bound, Oregon",
    url: "https://www.outwardbound.org/",
    text: "15 days with Northwest Outward Bound School: a week of rock climbing at Smith Rock, then alpine backpacking around Broken Top and a roped climb to its summit.",
    image: { src: "/about/smith-rock.webp", alt: "Atef rock climbing at Smith Rock, Oregon", width: 900, height: 675 },
  },
  currentlyTitle: "Where you'll find me",
  currently: [
    "Carolina Analytics and Data Science",
    "Product Management Club",
    "Center on Technology Policy",
    "Arabic Debate Club",
    "North African Students Organization",
    "Carolina Firsts (First-Generation Students)",
    "Climbing Club",
  ],
  routeTitle: "The route so far",
  // US places visited. DC is listed but not counted as a state.
  statesVisited: [
    "North Carolina",
    "California",
    "Oregon",
    "Massachusetts",
    "Minnesota",
    "Illinois",
    "New York",
    "District of Columbia",
    "Tennessee",
    "Pennsylvania",
  ],
};

// The route line. Coordinates are real; the map projects them. `code` is the country.
export type Stop = {
  code: string;
  city: string;
  place: string;
  icon: Icon;
  lat: number;
  lon: number;
  // Which side of the dot the label sits on, so labels never collide with the route.
  labelSide: "left" | "above" | "below";
};

export const route: Stop[] = [
  // Home village is in Sharqia; the pin sits at the governorate's approximate center.
  { code: "EG", city: "Sharqia", place: "Egypt 🇪🇬", icon: IconBuildingCottage, lat: 30.7, lon: 31.63, labelSide: "left" },
  {
    code: "ZA",
    city: "Johannesburg",
    place: "South Africa 🇿🇦",
    icon: IconBackpack,
    lat: -26.2,
    lon: 28.05,
    labelSide: "below",
  },
  {
    code: "US",
    city: "Chapel Hill",
    place: "USA 🇺🇸",
    icon: IconSchool,
    lat: 35.91,
    lon: -79.05,
    labelSide: "above",
  },
];
