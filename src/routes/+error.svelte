<script>
	import { page } from '$app/stores';
</script>

<div class="error-page">
    <h1 class="sm error-page__title">Er is iets misgegaan...</h1>

    <div class="error-page__divider"></div>
  
    {#if $page.error}
    <div class="error-page__content">
        {#if $page.status}
        <p class="error-page__status">{$page.status ?? 'Onbekend'}</p>
        {/if}

        {#if $page.error.message}
        <p class="sm error-page__message">{$page.error?.message ?? 'Geen details beschikbaar'}</p>
        {/if}
    </div>
    {/if}

    <div class="error-page__divider"></div>

    <a class="sm error-page__button" href="/">Home</a>
    
</div>

<div class="blob"></div>

<style>
.error-page{
    display: flex;
    flex-direction: column;   
    justify-content: center;  
    align-items: center;      
    text-align: center;   
    height: 100vh;      
}

.error-page__title{
    margin-bottom: 3rem;
}

.error-page__content{
    margin-top: 3rem;
    margin-bottom: 3rem;
}

.error-page__status{
    font-size: 10rem;
    font-size: clamp(6rem, 10vw, 10rem);
    color: var(--text);
}
.error-page__divider{
    width: 80vw;
    max-width: 30rem;
    height: 0.1rem;
    background-color: var(--accent);
    border-radius: 0.125rem;
}

.error-page__button{
    margin-top: 3rem;
    padding: 0.75rem 1.5rem;
    border: solid var(--accent) 0.125rem;
    border-radius: 25px;
    text-decoration: none;
    color: var(--text);
}

.error-page__button:hover {               
    transform: scale(1.05);          
}

.blob {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: -99;

  width: 90vw;
  height: 90vw;
  max-width: 40rem;
  max-height: 40rem;
  background-color: rgba(255, 255, 255, 0.077);

  animation: morph 7.5s ease-in-out infinite alternate, rotate 15s linear infinite;
}

@keyframes morph {
  0% {
    border-radius: 60% 45% 45% 70% / 60% 45% 45% 70%;
  }
  50% {
    border-radius: 40% 70% 60% 45% / 40% 70% 60% 45%;
  }
  100% {
    border-radius: 60% 45% 45% 70% / 60% 45% 45% 70%;
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
