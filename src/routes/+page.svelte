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
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }


</style>