function toggleAccordion(event) {
    event.preventDefault();
    const accordionContent = event.currentTarget.nextElementSibling;
    const allContents = document.querySelectorAll('.accordion-content');

    // Close all other open accordions
    allContents.forEach(content => {
      if (content !== accordionContent) {
        content.classList.add('hidden');
        content.style.maxHeight = '0'; // Reset max-height for animation
      }
    });

    // Toggle the clicked accordion
    if (accordionContent.classList.contains('hidden')) {
      accordionContent.classList.remove('hidden');
      accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px'; // Set max-height for animation
    } else {
      accordionContent.classList.add('hidden');
      accordionContent.style.maxHeight = '0'; // Reset max-height for animation
    }
  }