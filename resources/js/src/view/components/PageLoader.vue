<template>
    <div v-if="isLoading" class="loader-overlay">
      <div class="logo-container">
        <img src="/media/custome/loader.png" alt="Logo" class="logo" />
        <div class="loading-text">
          Loading
          <span class="dot dot1">.</span>
          <span class="dot dot2">.</span>
          <span class="dot dot3">.</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoading: true, // Initially, the loader is shown
      };
    },
    
    methods: {
      hideLoader() {
        this.isLoading = false;
      },
      showLoader() {
        this.isLoading = true;
      },
    },

    mounted() {
      // Simulate page load or data fetching
      window.onload = () => {
        this.hideLoader();
      };
    },

    created() {
      // Show the loader until the page is fully loaded (e.g., images, CSS, etc.)
      // window.onload = this.hideLoader; // Hide loader when everything is loaded
    },

  };
  </script>
  
  <style scoped>
  /* Loader Overlay */
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
  }
  
  /* Logo Container */
  .logo-container {
    text-align: center;
  }
  
  /* Styling the Logo */
  .logo {
    width: 150px; /* Adjust size of the logo */
    height: auto;
    margin-bottom: 20px;
  }
  
  /* Loading Text Style */
  .loading-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    position: relative;
  }
  
  /* Dots Animation */
  .dot {
    display: inline-block;
    opacity: 0;
    animation: dot-blink 1.5s infinite step-start;
  }
  
  .dot1 {
    animation-delay: 0s;
  }
  
  .dot2 {
    animation-delay: 0.3s;
  }
  
  .dot3 {
    animation-delay: 0.6s;
  }
  
  /* Dot blink animation */
  @keyframes dot-blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  </style>