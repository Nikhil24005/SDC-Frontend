import { publicApi } from '../axios';

export const getGoldenAlumini = async () => {
  try {
    const res = await publicApi.get('/public/people/golden-alumni');

    const alumniList = res.data?.data || [];

    const sorted = alumniList
      .map((a) => {
        // Extract numeric value from package string (e.g., "45 LPA" -> 45)
        const packageStr = a.package || '0';
        const parsedLpa = parseFloat(packageStr.match(/\d+(\.\d+)?/)?.[0] || '0');
        return {
          aluminiName: a.name,
          companyName: a.company || a.designation,
          lpa: a.package || 'N/A',
          content: a.bio || '',
          image: a.image,
          parsedLpa
        };
      })
      .filter((a) => {
        const valid = !isNaN(a.parsedLpa) && a.parsedLpa > 0;
        if (!valid) console.warn("Invalid LPA found:", a.lpa);
        return valid;
      })
      .sort((a, b) => b.parsedLpa - a.parsedLpa)
      .slice(0, 3);

    return sorted;
  } catch (error) {
    console.error('Error fetching golden alumni:', error);
    return [];
  }
};
