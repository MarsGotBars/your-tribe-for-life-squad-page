export async function load({ url }) {
  const members = await fetch(
    "https://fdnd.directus.app/items/person?fields=name,bio,profilecard,mugshot,birthdate&filter[squads][squad_id][cohort][_eq]=2526&filter[squads][squad_id][tribe][name][_eq]=FDND%20Jaar%202"
  );

  const { data: membersData } = await members.json();

  function calculateAge(dateString) {
    if (!dateString) {
      return null; // or any default value you prefer
    }
  
    const today = new Date();
    const birthDate = new Date(dateString);
  
    if (isNaN(birthDate.getTime())) {
      return null; // or any default value you prefer
    }
  
    let age = today.getFullYear() - birthDate.getFullYear();
  
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    const birthdayHasPassed =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0);
  
    if (!birthdayHasPassed) {
      age--;
    }
  
    return age;
  }

  // Loop om mugshot data te verkrijgen & aan de bestaande (membersData) te koppelen
  // Wacht tot alle mugshot data verkregen is voordat we verdergaan
  await Promise.all(
    membersData.map(async (member) => {
      // Fetch mugshot data
      const mugshotResponse = await fetch(
        `https://fdnd.directus.app/files/${member.mugshot}`
      );

      // Verwerk de mugshot data
      const { data: mugshotData } = await mugshotResponse.json();

      const customHeight = 500;

      // Koppel de mugshot data aan de bestaande (membersData) als een object
      member.mugshot = {
        src: `https://fdnd.directus.app/assets/${member.mugshot}?height=${customHeight}&quality=80`,
        // Bereken de breedte op basis van de hoogte
        width: mugshotData?.width ? (customHeight * mugshotData.width) / mugshotData.height : null,
        height: customHeight,
      };
      
      // Bereken de leeftijd
      member.age = calculateAge(member.birthdate);
    })
  );

  return { membersData };
}
