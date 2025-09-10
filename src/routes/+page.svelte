<script>
  import { onMount } from "svelte";

  let { data } = $props();
  const members = data.membersData;

  // Media query check for large screens
  let isLargeScreen = $state(false);

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
    // Only enable hover effect on large screens
    if (!isLargeScreen) return;

    // Als de muis over de person container gaat
    isHovering = true;
    // Vind de img element
    const targetImg = event.target.closest("details").querySelector("img");

    if (imgHistory.at(-1) === targetImg.src) {
      return; // Don't add duplicate
    }
    // Cancel alle bestaande removal timers
    removalTimers.forEach((timer) => clearTimeout(timer));
    // Reset de removalTimers array
    removalTimers = [];

    // Voeg de images toe aan de imgHistory array
    imgHistory = [...imgHistory, targetImg.src];

    // Creëer en voeg de nieuwe img element toe aan de floatContainer
    const newImg = document.createElement("img");
    newImg.src = targetImg.src;
    newImg.alt = targetImg.alt
      ? targetImg.alt
      : "Mugshot van " + targetImg.dataset.name;
    floatContainer.appendChild(newImg);

    // Start een nieuwe removal chain
    const timer = setTimeout(() => {
      removeOldImages();
    }, 400);
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
    // Set up media query
    const mediaQuery = window.matchMedia("(min-width: 62.5rem)");

    // Set initial value
    isLargeScreen = mediaQuery.matches;

    // Listen for changes
    const handleMediaChange = (e) => {
      isLargeScreen = e.matches;
      // Reset hover state when switching to small screen
      if (!e.matches) {
        isHovering = false;
        imgHistory = [];
        if (floatContainer) {
          floatContainer.innerHTML = "";
        }
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  });
</script>

<picture
  class="float"
  data-active={isHovering ? "shown" : "hidden"}
  style="top: {mouseY}px;"
  bind:this={floatContainer}
>
</picture>
<main class="person-container">
  {#each members as member, index}
    <details
      name="person"
      class="person"
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      <summary>
        <div class="name-birthdate-container">
          <h2 class="md">{member.name}</h2>
          <p class="birthdate">
            {member.age ? member.age + " Jaar" : "Leeftijd onbekend"}
          </p>
        </div>
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
        <div class="group">
          <p>{member.bio ? member.bio : "Ik heb niks opgeschreven :)"}</p>

          <a
            class="githubhandle"
            href="https://github.com/{member.github_handle}"
            aria-label="Github link"
          >
            <span>Github</span>
          </a>
        </div>
      </article>
    </details>
  {/each}
</main>

<style>
  @font-face {
    font-family: "Lexend Deca";
    src:
      url("/fonts/lexenddeca.woff2") format("woff2"),
      url("/fonts/lexenddeca.woff") format("woff");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :global(html, body) {
    height: 100%;
    background: var(--bg);
    margin: 0;
    font-family: "Lexend Deca", sans-serif;
    font-size: 16px;

    @media (min-width: 62.5rem) {
      font-size: 1.1rem;
    }
  }

  .person {
    align-items: center;
    margin-inline: 0.63rem;
    border-bottom: 1px solid var(--accent);
    transition: border-color 0.4s var(--bezier);
    &:open {
      border-bottom: transparent;
    }

    @media (min-width: 50rem) {
      margin-inline: 2.25rem;
    }

    &:hover,
    &:hover article {
      border-color: #4e4e4e;
    }

    summary {
      position: relative;
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
      }

      .birthdate {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text);
        padding-top: 0.5rem;
        @media (min-width: 50rem) {
          padding-top: unset;
        }
      }

      &::after {
        content: "+";
        position: absolute;
        right: 5%;
        top: 50%;
        transform: translateY(-50%);
        font-size: 3rem;
        color: var(--text);
        display: flex;
        line-height: 0.75;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s var(--bezier);
      }
      &:hover::after {
        transform: translateY(-50%) rotate(15deg);
      }
    }

    &:open summary::after {
      transform: translateY(-50%) rotate(135deg);
    }

    article {
      border-top: 1px solid var(--accent);
      padding-top: 1rem;
      display: flex;
      gap: 1.125rem;
      transition: border-color 0.3s var(--bezier);
      .group {
        max-width: 33%;
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        flex-direction: column;
        @media (min-width: 62.5rem) {
          max-width: min(70ch, 50%);
        }
      }

      picture {
        display: inline-block;
        max-width: 50%;
        @media (min-width: 62.5rem) {
          display: none;
        }
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

    span {
      font-size: 1.25rem;
      padding: 1rem 0;
    }
  }

  .person-container {
    padding-block: 10vh;
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .person {
        opacity: 0;
        transform: translateY(100%);
        animation: animate-in linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 100%;
      }
    }
  }

  @keyframes animate-in {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    20% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  .float {
    z-index: 1;
    position: fixed;
    top: 0;
    transform: translate(-50%, -50%);
    right: 2.5%;
    width: clamp(18.75rem, 24vw, 25rem);
    height: clamp(20rem, 25vw, 30rem);
    background-color: transparent;
    pointer-events: none;
    display: grid;
    transition:
      opacity 0.4s var(--bezier),
      filter 0.4s var(--bezier);

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
    animation: clip-in 0.4s var(--bezier);
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
