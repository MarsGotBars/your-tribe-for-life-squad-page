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
    const targetImg = event.target.closest("li").querySelector("img");

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

<header>
  <h1 class="lg" style="--delay: .1s">Frontend Design & Development</h1>
  <p class="sm" style="--delay: .15s">Squadpage 2025-2026</p>
</header>

<picture
  class="float"
  data-active={isHovering ? "shown" : "hidden"}
  style="--mouseCord: {mouseY}px;"
  bind:this={floatContainer}
>
</picture>

<ul class="person-container" style="--delay: .2s">
  {#each members as member, index}
    <li
      name="person"
      class="person"
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      <a href="/{member.id}">
        <div>
          <h2 class="md" style="view-transition-name: member-{member.id}">{member.name}</h2>
          <p class="birthdate sm">
            {member.age ? member.age + " Jaar" : "Leeftijd onbekend"}
          </p>
        </div>

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
      </a>
    </li>
  {/each}
</ul>

<style>
  header {
    margin-bottom: 2rem;
  }

  header > * {
    transform: translate(-10px, -10px);
    clip-path: inset(0 100% 0 0);
    animation: clip-right var(--bezier) .5s var(--delay, .15s) forwards;
  }

  ul {
    transform: translate(-10px, -10px);
    clip-path: inset(0 100% 0 0);
    animation: clip-right var(--bezier) .5s var(--delay, .2s) forwards;
  }

  h1 + p {
    margin-top: 1.75rem;
  }

  .person {
    list-style: none;
    border-bottom: 1px solid var(--accent);
    transition: border 0.15s var(--bezier);
    color: var(--text);
  }

  .person:hover {
    border-bottom: 1px solid #4e4e4e;
  }

  .person a {
    color: inherit;
    padding-top: 1.5rem;
    padding-bottom: 2.25rem;
    display: flex;
    position: relative;
  }

  .person a p {
    margin-top: 0.5rem;
  }

  .person a::after {
    --size: 0.75rem;
    content: "";
    position: absolute;
    right: calc(var(--size) * 2);
    top: 50%;
    width: var(--size);
    height: var(--size);
    border-right: 1px solid var(--text);
    border-top: 1px solid var(--text);
    transform: translate(0rem, -50%) rotate(45deg);
    transition:
      border-width var(--bezier) 0.15s,
      transform var(--bezier) 0.3s;
  }

  .person a:hover::after {
    border-width: 2px;
    transform: translate(var(--size), -50%) rotate(45deg);
  }

  .person a div {
    display: block;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    flex: 0 0 66%;
    gap: 2rem;
  }

  @media (min-width: 50rem) {
    .person a div {
      display: grid;
    }

    .person a p {
      margin-top: unset;
    }
  }

  .person picture {
    display: none;
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .person {
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
    --mouseCord: 0;
    z-index: 1;
    position: fixed;
    top: 0;
    transform: translate(-50%, calc(-50% + var(--mouseCord)));
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

  @keyframes clip-right {
    to {
      transform: translate(0, 0);
      clip-path: inset(0 0 0 0);
    }
  }
</style>
