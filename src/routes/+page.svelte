<script>
  import { onMount } from "svelte";

  let { data } = $props();
  const members = data.membersData;

  // Variables
  let mouseY = $state(0);
  let isHovering = $state(false);
  let imgHistory = $state([]);
  let floatContainer;

  // Muis
  function updateMousePosition(event) {
    if (isHovering) {
      mouseY = event.clientY;
    }
  }

  // Timers voor het verwijderen van de oude images
  let removalTimers = [];

  // Muis Enter
  function handleMouseEnter(event) {
  // Als de muis over de person container gaat
  isHovering = true;
  // Vind de img element
  const targetImg = event.target.closest("details").querySelector("img");
  
  if (imgHistory.at(-1) === targetImg.src) {
    return; // Don't add duplicate
  }
  // Cancel alle bestaande removal timers
  removalTimers.forEach(timer => clearTimeout(timer));
  // Reset de removalTimers array
  removalTimers = [];
  
  // Voeg de images toe aan de imgHistory array
  imgHistory = [...imgHistory, targetImg.src];
  
  // Creëer en voeg de nieuwe img element toe aan de floatContainer
  const newImg = document.createElement("img");
  newImg.src = targetImg.src;
  newImg.alt = targetImg.alt ? targetImg.alt : "Mugshot van " + targetImg.dataset.name;
  floatContainer.appendChild(newImg);
  
  // Start een nieuwe removal chain
  const timer = setTimeout(() => {
    removeOldImages();
  }, 200);
  // Voeg de timer toe aan de removalTimers array
  removalTimers.push(timer);
}

  // Verwijder de oude images
function removeOldImages() {
  // Als er meer dan 1 image in de imgHistory array is en er meer dan 1 image in de floatContainer is
  if (imgHistory.length > 1 && floatContainer.children.length > 1) {
    // Verwijder de eerste image uit de imgHistory array
    imgHistory = imgHistory.slice(1);
    
    if (floatContainer.firstElementChild) {
      // Verwijder de eerste image uit de floatContainer
      floatContainer.removeChild(floatContainer.firstElementChild);
    }
    
    // Als er meer dan 1 image in de imgHistory array is
    if (imgHistory.length > 1) {
      const timer = setTimeout(removeOldImages, 400);
      // Voeg de timer toe aan de removalTimers array
      removalTimers.push(timer);
    }
  }
}

  // Muis Leave
  function handleMouseLeave() {
    isHovering = false;
  }

  // Mount eventListener
  onMount(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  });
</script>

<picture
  class="float"
  data-active={isHovering ? 'shown' : 'hidden'}
  style="top: {mouseY}px;"
  bind:this={floatContainer}
>

</picture>
<main class="person-container">
  {#each members as member, index}
    <details
      class="person"
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      <summary>
        <div class="name-birthdate-container">
          <h2>{member.name}</h2>
          <p class="birthdate">
            {member.age ? member.age + " Jaar" : "Leeftijd onbekend"}
          </p>
        </div>
        <a class="cross" href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            ><g class="plus-outline"
              ><g
                fill="#666"
                fill-rule="evenodd"
                class="Vector"
                clip-rule="evenodd"
                ><path
                  d="M12 3a1 1 0 0 1 1 1v16a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1"
                /><path
                  d="M21 12a1 1 0 0 1-1 1H4a1 1 0 1 1 0-2h16a1 1 0 0 1 1 1"
                /></g
              ></g
            ></svg
          >
        </a>
      </summary>
      <article>
        <picture>
          <source
            srcset={`${member.mugshot.src}&format=avif`}
            type="image/avif"
          />
          <source
            srcset={`${member.mugshot.src}&format=webp`}
            type="image/webp"
          />
          <img
            src={`${member.mugshot.src}&format=jpg`}
            alt="Mugshot van {member.name}"
            data-name={member.name} 
            width={member.mugshot.width}
            height={member.mugshot.height}
            loading={index >= 12 ? "lazy" : "eager"}
          />
        </picture>
        <p>{member.bio}</p>
        <a
          class="githubhandle"
          href="https://github.com/{member.github_handle}"
          aria-label="Github link"
        >
          <p>Github</p>
        </a>
      </article>
    </details>
  {/each}
</main>

<style>
  @import "./App.css";

  :global(html, body) {
    height: 100%;
    background: var(--bg);
    margin: 0;
    font-family: sans-serif;
    font-size: 16px;

    @media (min-width: 62.5rem) {
      font-size: 1.1rem;
    }
  }

  .person {
    align-items: center;
    margin-inline: 0.63rem;
    border-bottom: 1px solid var(--accent);

    &:open {
      border-bottom: none;
    }

    @media (min-width: 50rem) {
      margin-inline: 2.25rem;
    }

    &:last-child {
      border-bottom: none;
    }

    summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding-block: 0.63rem;

      @media (min-width: 50rem) {
        padding-block: 2.25rem;
      }

      h2 {
        margin: 0;
        color: var(--text);
        font-size: 2rem;
        overflow: hidden;
      }

      .birthdate {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text);
      }

      .cross {
        display: flex;
        align-items: center;
      }
    }

    article {
      margin-top: 2.25rem;
      border-top: 1px solid var(--accent);
      margin-top: 0rem;
      padding-top: 1rem;

      picture {
        display: inline-block;
        width: 100%;
        max-width: 32rem;

        img {
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }
      }
    }
  }

  .name-birthdate-container {
    flex-grow: 1;
    display: block;

    @media (min-width: 50rem) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      flex: 0 0 66%;
      gap: 2rem;
    }
  }

  .githubhandle {
    all: unset;
    cursor: pointer;

    p {
      font-size: 1.25rem;
      padding: 1rem 0;
    }
  }

  .float {
    position: fixed;
    top: 0;
    transform: translateY(-50%);
    right: 20vw;
    width: 18.75rem;
    height: 20rem;
    background-color: transparent;
    pointer-events: none;
    display: grid;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &[data-active="shown"] {
      opacity: 1;
      filter: blur(0px);
    }

    &[data-active="hidden"] {
      opacity: 0;
      filter: blur(40px);
    }
  }

  :global(.float :is(img, source)) {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    animation: clip-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes clip-in {
    from {
      clip-path: inset(100% 0 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
</style>
