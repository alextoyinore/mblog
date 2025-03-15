// artworkPreview.js

// Preview artwork
export function previewArtwork(input) {
    const preview = document.getElementById("artworkPreview");
    const uploadPrompt = document.getElementById("uploadPrompt");
  
    if (input.files && input.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
        uploadPrompt.classList.add("hidden");
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  // Update song file name
  export function updateFileName(input) {
    const fileName = document.getElementById("songFileName");
    if (input.files && input.files[0]) {
      fileName.textContent = input.files[0].name;
    }
  }