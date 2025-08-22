/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

// Toggle between Day and Night Mode
let isDay = true;
document.getElementById("toggleMode").addEventListener("click", () => {
  isDay = !isDay;

  if (isDay) {
    // Day mode - Blue sky background
    document.body.classList.remove("dark-mode");

    // Logo switching
    document.getElementById("white-logo").style.display = "none";
    document.getElementById("black-logo").style.display = "block";

    // Button styling
    document
      .getElementById("toggleMode")
      .classList.replace("btn-light", "btn-secondary");
    document
      .getElementById("togglebtn")
      .classList.replace("bi-sun", "bi-moon-fill");
    // Change advancedSearchDiv background for day
    document
      .getElementById("advancedSearchDiv")
      .classList.remove("advanced-search-night");
    document
      .getElementById("advancedSearchDiv")
      .classList.add("advanced-search-day");
  } else {
    // Night mode - Dark clouds background
    document.body.classList.add("dark-mode");

    // Logo switching
    document.getElementById("white-logo").style.display = "block";
    document.getElementById("black-logo").style.display = "none";

    // Button styling
    // document.getElementById("toggleMode").classList.replace("btn-secondary", "btn-light");
    document
      .getElementById("togglebtn")
      .classList.replace("bi-moon-fill", "bi-sun");
    // Change advancedSearchDiv background for night
    document
      .getElementById("advancedSearchDiv")
      .classList.remove("advanced-search-day");
    document
      .getElementById("advancedSearchDiv")
      .classList.add("advanced-search-night");
  }
});

// Toggle between card and table view
function toggleView() {
  const icon = document.querySelector(".togglebtn i");
  if (icon.classList.contains("bi-list-ul")) {
    icon.classList.replace("bi-list-ul", "bi-grid-3x3-gap-fill");
  } else {
    icon.classList.replace("bi-grid-3x3-gap-fill", "bi-list-ul");
  }
  const card = document.getElementById("cardView");
  const table = document.getElementById("tableView");

  if (card.style.display === "none") {
    card.style.display = "flex";
    table.style.display = "none";
  } else {
    card.style.display = "none";
    table.style.display = "block";
  }
}
// save Queery
function saveQuery() {
  const author = document.getElementById("author").value;
  const SBnumber = document.getElementById("SBnumber").value;
  const model = document.getElementById("aircraftSelect").value;
  const revision = document.getElementById("revision").value;
  const resolverName = document.getElementById("resolvername").value;
  const comments = document.getElementById("comments").value;

  if (!author || !SBnumber || !model || !revision || !resolverName) {
    Swal.fire({
      position: "top-end",
      title:
        " <h1 style='font-size: 1.5rem;color: #dc3545;'> <i style='font-size: 1.5rem;color: #dc3545;' class='bi bi-exclamation-circle'></i> Validation Failed</h1>",
      text: "Please fill in all required fields.",
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500,
      customClass: {
        popup: "swal-danger",
      },
    });
    return;
  }

  const query = {
    author,
    SBnumber,
    model,
    revision,
    resolverName,
    comments,
  };

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          position: "top-end",
          title:
            "<h1 style='font-size: 1.5rem;color: #28a745;'> Query saved successfully!</h1>",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: {
            popup: "swal-success",
          },
        });

        document.getElementById("addQueryForm").reset();

        const modalElement = document.getElementById("AddQueryModal");
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.hide();
        modalElement.classList.remove("show");
        modalElement.style.display = "none";
        modalElement.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();

        // document.location.reload();
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: data.message || "Error saving query.",
          confirmButtonText: "OK",
        });
      }
    })

    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Request Failed",
        text: "An error occurred while saving the query.",
        confirmButtonText: "OK",
      });
    });
}
// function saveQuery() {
//   const author = document.getElementById("author").value;
//   const SBnumber = document.getElementById("SBnumber").value;
//   const model = document.getElementById("aircraftSelect").value;
//   const revision = document.getElementById("revision").value;
//   const resolverName = document.getElementById("resolvername").value;
//   const comments = document.getElementById("comments").value;

//   if (!author || !SBnumber || !model || !revision || !resolverName) {
//     Swal.fire({
//       position: "top-end",
//       title: "<h1 style='font-size: 1.5rem;color: #dc3545;'> <i style='font-size: 1.5rem;color: #dc3545;' class='bi bi-exclamation-circle'></i> Validation Failed</h1>",
//       text: "Please fill in all required fields.",
//       showConfirmButton: false,
//       timerProgressBar: true,
//       timer: 1500,
//       customClass: {
//         popup: "swal-danger",
//       },
//     });
//     return;
//   }

//   const query = {
//     author,
//     SBnumber,
//     model,
//     revision,
//     resolverName,
//     comments,
//   };

//   fetch("/add", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(query),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         Swal.fire({
//           position: "top-end",
//           title: "<h1 style='font-size: 1.5rem;color: #28a745;'> Query saved successfully!</h1>",
//           showConfirmButton: false,
//           timer: 1500,
//           timerProgressBar: true,
//           customClass: {
//             popup: "swal-success",
//           },
//         });

//         // Reset form
//         document.getElementById("addQueryForm").reset();

//         // Simply hide the modal - let Bootstrap handle the cleanup
//         const modalElement = document.getElementById("AddQueryModal");
//         const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
//         modalInstance.hide();

//         // Optional: reload page if needed
//         // document.location.reload();
//       } else {
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error",
//           text: data.message || "Error saving query.",
//           confirmButtonText: "OK",
//         });
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Request Failed",
//         text: "An error occurred while saving the query.",
//         confirmButtonText: "OK",
//       });
//     });
// }
// Call this function when the Save button is clicked
// function saveQuery() {
//   // Get form values
//   const author = document.getElementById("author").value;
//   const SBnumber = document.getElementById("SBnumber").value;
//   const model = document.getElementById("aircraftSelect").value;
//   const revision = document.getElementById("revision").value;
//   const resolverName = document.getElementById("resolvername").value;
//   const comments = document.getElementById("comments").value;

//   // Basic validation
//   if (!author || !SBnumber || !model || !revision || !resolverName) {
//     Swal.fire({
//       position: "top-end",
//       title:
//         "<h1 style='font-size: 1.5rem;color: #dc3545;'> <i style='font-size: 1.5rem;color: #dc3545;' class='bi bi-exclamation-circle'></i> Validation Failed</h1>",
//       text: "Please fill in all required fields.",
//       showConfirmButton: false,
//       timerProgressBar: true,
//       timer: 1500,
//       customClass: {
//         popup: "swal-danger",
//       },
//     });
//     return;
//   }

//   // Prepare payload
//   const query = {
//     author,
//     SBnumber,
//     model,
//     revision,
//     resolverName,
//     comments,
//   };

//   // Submit query
//   fetch("/add", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(query),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.success) {
//         Swal.fire({
//           position: "top-end",
//           title: "<h1 style='font-size: 1.5rem;color: #28a745;'> Query saved successfully!</h1>",
//           showConfirmButton: false,
//           timer: 1500,
//           timerProgressBar: true,
//           customClass: {
//             popup: "swal-success",
//           },
//         });

//         // Reset the form
//         document.getElementById("addQueryForm").reset();

//         // Modal and DOM cleanup
//         const modalElement = document.getElementById("AddQueryModal");

//         // Remove all modal-related classes and attributes to disable modal completely
//         modalElement.classList.remove("show", "fade");
//         modalElement.style.display = "none";
//         modalElement.setAttribute("aria-hidden", "true");
//         modalElement.removeAttribute("aria-modal");
//         modalElement.removeAttribute("role");

//         // Clean up <body> overflow and padding
//         document.body.classList.remove("modal-open");
//         document.body.style.overflow = "";
//         document.body.style.paddingRight = "";

//         // Remove all existing Bootstrap backdrops
//         document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());

//         // Restore the modal fade class (Bootstrap expects it on next open)
//         setTimeout(() => {
//           modalElement.classList.add("fade");
//         }, 150);
//       } else {
//         // If server returns error
//         Swal.fire({
//           position: "top-end",
//           icon: "error",
//           title: "Error",
//           text: data.message || "Error saving query.",
//           confirmButtonText: "OK",
//         });
//       }
//     })
//     .catch((error) => {
//       // If fetch fails (network/server error)
//       console.error("Error:", error);
//       Swal.fire({
//         position: "top-end",
//         icon: "error",
//         title: "Request Failed",
//         text: "An error occurred while saving the query.",
//         confirmButtonText: "OK",
//       });
//     });
// }

// Attach event listener after DOM is loaded
// document.addEventListener("DOMContentLoaded", function() {
//   const saveButton = document.getElementById("saveQueryBtn");
//   if (saveButton) {
//     saveButton.addEventListener("click", saveQuery);
//   }
// });

// // Add event listener to the save button

document.getElementById("saveQueryBtn").addEventListener("click", saveQuery);

//Export to CSV
document.getElementById("exportCSV").addEventListener("click", () => {
  Swal.fire({
    title: "Export to CSV",
    text: "Are you sure you want to export the data to CSV?",
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: "Cancel",
    preConfirm: () => {
      // Trigger the CSV export
      window.location.href = "/export";
    },
  });
});

//search button
document.getElementById("searchButton").addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput").value.trim();
  if (!searchInput) {
    Swal.fire({
      title:
        " <h1 style='font-size: 1.75rem;color: #dc3545;'> <i style='font-size: 1.5rem;color: #dc3545;' class='bi bi-exclamation-circle'></i> Please enter a search term</h1>",

      showConfirmButton: true,
    });
  } else {
    window.location.href = `/search?search=${searchInput}`;
  }
});

document.getElementById("advancedSearch").addEventListener("click", () => {
  const advancedSearchbutton = document.getElementById("advancedSearchDiv");
  advancedSearchbutton.classList.remove("d-none");
  advancedSearchbutton.classList.add("show");
});

document
  .getElementById("advancedSearchCloseBtn")
  .addEventListener("click", () => {
    const advancedSearchbutton = document.getElementById("advancedSearchDiv");
    advancedSearchbutton.classList.replace("show", "d-none");
  });

function handleFileUpload(input, index) {
  const file = input.files[0];

  if (!file) {
    Swal.fire({
      icon: "warning",
      title: "No File Selected",
      text: "Please select a PDF file.",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  // Check if it's a PDF
  if (file.type !== "application/pdf") {
    Swal.fire({
      icon: "error",
      title: "Invalid File Type",
      text: "Please select only PDF files.",
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
    input.value = ""; // Clear the input
    return;
  }

  // Check file size (e.g., 5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({
      icon: "error",
      title: "File Too Large",
      text: "Please select a file smaller than 5MB.",
      showConfirmButton: true,
      confirmButtonText: "OK",
    });
    input.value = ""; // Clear the input
    return;
  }

  // Success message
  Swal.fire({
    icon: "success",
    title: "File Selected!",
    text: `${file.name} has been selected successfully.`,
    timer: 2000,
    showConfirmButton: true,
  }).then(() => {
    const saveButton = document.getElementById(`saveButton-${index}`);
    const uploadButton = document.getElementById(`uploadButton-${index}`);
    if (saveButton && uploadButton) {
      uploadButton.classList.add("d-none");
      saveButton.classList.remove("d-none");
    }
  });

  // Update the display element
  const displayElement = document.getElementById(`selectedFile-${index}`);
  if (displayElement) {
    displayElement.textContent = file.name;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const pdfModal = document.getElementById("pdfModal");
  const pdfFrame = document.getElementById("pdfFrame");

  // Listen for modal show event
  pdfModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget; // Button that triggered the modal
    const pdfUrl = button.getAttribute("data-pdf-url"); // Extract PDF URL
    pdfFrame.src = pdfUrl; // Set iframe source
  });

  // Clear iframe when modal closes (optional, for performance)
  pdfModal.addEventListener("hidden.bs.modal", function () {
    pdfFrame.src = "";
  });
});

const scrollTopBtn = document.getElementById("upButton");
const scrollBottomBtn = document.getElementById("downButton");

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

scrollBottomBtn.addEventListener("click", () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  tooltipTriggerList.forEach((el) => {
    new bootstrap.Tooltip(el);
  });
});
