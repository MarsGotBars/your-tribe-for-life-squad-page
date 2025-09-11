<script>
  let { data } = $props();

  const member = data.memberData;  
  console.log(member);
  
</script>

<header class="back-link">
  <a href="">Terug naar overzicht</a>
</header>

<main>

  <h1 class="about">Over</h1>

  <section class="profile">
    <picture class="profile-img">
      <source
        srcset={`https://fdnd.directus.app/assets/${member.mugshot}?height=500&quality=80&format=avif`}
        type="image/avif"
      />
      <source
        srcset={`https://fdnd.directus.app/assets/${member.mugshot}?height=500&quality=80&format=webp`}
        type="image/webp"
      />
      <img
        src={`https://fdnd.directus.app/assets/${member.mugshot}?height=500&quality=80&format=jpg`}
        alt={`Mugshot van ${member.name}`}
        width="auto"
        height="500"
      />
    </picture>

    <div class="table-container">
      <div class="table-fullpage-wrapper">
        <div class="table">
          <article>
            <h2>Naam</h2>
            <p class="md">{member.name}</p>
          </article>
          <article class="outline-right">
            <h2>Functie</h2>
            <p class="md">{member.role}</p>
          </article>
        </div>
      </div>

      <div class="table">
        <article>
          <h2>Leeftijd</h2>
          <p class="md">{member.age ? member.age + " Jaar" : "Leeftijd onbekend"}</p>
        </article>
        <article class="outline-right">
          <h2>Github</h2>
          <p class="md">@{member.github_handle}</p>
        </article>
      </div>

      <article class="bio">
        <h2>Bio</h2>
        <p>{member.bio}</p>
      </article>
    </div>
    

  </section>

</main>

<style>
  .about {
    display: flex;
    justify-content: center;
    font-size: 6rem;
  }

  .profile-img {
    display: flex;
    justify-content: center;
    
    img {
      position: fixed;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      max-width: 40%;
      height: auto;
      display: block;
      margin-top: 1rem;
      z-index: 1000;
    }
  }

  .table-container {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
  
  .table-fullpage-wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }

  .table {
    display: flex;
    align-items: start;
    justify-content: space-between;
    border-top: 1px solid var(--accent);

    article {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
    }

    h2 {
      margin-top: 1rem;
    }

    p {
      margin-bottom: .5rem;
    }
  }

  .outline-right {
    text-align: right;
  }

  .bio {
    width: 40%;
    margin-inline: auto;
    margin-block: 1rem;
  }

</style>