<script>
  let { data } = $props();

  const member = data.memberData;  
  console.log(member);
  
</script>

<header class="back-link">
  <a class="xs" href="/">
    <svg class="icon" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7.5L1.29289 6.79289L0.585786 7.5L1.29289 8.20711L2 7.5ZM2 7.5L2.70711 8.20711L9.20711 1.70711L8.5 1L7.79289 0.292894L1.29289 6.79289L2 7.5ZM8.5 14L9.20711 13.2929L2.70711 6.79289L2 7.5L1.29289 8.20711L7.79289 14.7071L8.5 14Z" fill="#ECFFE7"/>
    </svg>
    Terug naar overzicht
  </a>
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
            <p class="md">{ member.role[0] == "member" ? "Student" : "Docent" }</p>
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
  .back-link {
    z-index: 2000;
    position: relative;
    display: flex;
    margin: 2rem;

    .icon {
      width: .8em;
      height: auto;
    }

    a {
      display: flex;
      align-content: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text);
      cursor: pointer;
    }
  }

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
      max-width: 30rem;
      height: auto;
      display: block;
      margin-top: 1rem;
      z-index: 10;
      margin-inline: 0.63rem;

      @media (max-width: 600px) {
        width: 17rem;
      }
    }
  }

  .table-container {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding-inline: 2.25rem;

    @media (max-width: 600px) {
      padding-inline: 0.63rem;

      article {
        width: 100%;
        border-top: 1px solid var(--accent);
      }
    }
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
    justify-content: center;
    border-top: 1px solid var(--accent);

    @media (max-width: 600px) {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      border: none;
    }  

    article {
      padding-block: 1rem;
      flex: 1 1 0;
    }

    h2 {
      /* margin-top: 1rem; */
    }

    p {
      /* margin-bottom: .5rem; */
      position: relative;
      z-index: 20;
      white-space: wrap;
      word-break: break-word;
    }
  }

  .outline-right {
    text-align: right;

    @media (max-width: 600px) {
      text-align: left;
    }

  }

  .bio {
    width: 30rem;
    margin-inline: auto;
    padding-top: 1rem;
    padding-bottom: 3rem;
  }

  @supports (animation-timeline: scroll()) {
    .profile-img img {
      animation: fade-out linear;
      animation-timeline: scroll(block root);
      animation-range: 0% 100%;
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: .20;
        transform: translateY(-30rem);
      }
    }
  }

</style>