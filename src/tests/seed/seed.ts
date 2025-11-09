import {Category} from "../../models/categories/category.model";
import {Mbti} from "../../models/mbti/mbti.model";

import { Enneagram } from "../../models/enneagram/enneagram.model";
import { Zodiac } from "../../models/zodiacs/zodiac.model";

export async function seedTestDB() {
  // Seed Categories
  const categories = [
    "Anime", "Music", "Politics", "Historians", "Gaming", "Art",
    "Comics", "Science", "Philosophy", "Movies", "Television",
    "Literature", "Business", "Religion", "Pop Culture",
    "Internet", "Technology"
  ];
  await Category.insertMany(categories.map(name => ({ name })));

  // Seed MBTI
  const mbtiList = [
    "INFP","INFJ","ENFP","ENFJ","INTJ","INTP","ENTP","ENTJ",
    "ISFP","ISFJ","ESFP","ESFJ","ISTP","ISTJ","ESTP","ESTJ"
  ];
  await Mbti.insertMany(mbtiList.map(code => ({ code })));

  // Seed Enneagram
  const enneagramList = [
    "1w2","2w3","3w2","3w4","4w3","4w5","5w4","5w6","6w5","6w7",
    "7w6","7w8","8w7","8w9","9w8","9w1"
  ];
  await Enneagram.insertMany(enneagramList.map(code => ({ code })));

  // Seed Zodiac
  const zodiacList = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra",
    "Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
  ];
  await Zodiac.insertMany(zodiacList.map(name => ({ name })));
}
