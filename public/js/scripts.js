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
        document.location.reload();
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

// Add event listener to the save button
document.getElementById("saveQueryBtn").addEventListener("click", saveQuery);

//Export to CSV
document.getElementById('exportCSV').addEventListener('click',()=>{
  Swal.fire({
    title:'Export to CSV',
    text:"Are you sure you want to export the data to CSV?",
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      // Trigger the CSV export
      window.location.href = '/export';
    }

  })
})

//search button
document.getElementById('searchButton').addEventListener('click',()=>{
  const searchInput = document.getElementById('searchInput').value.trim();
  if(!searchInput){
    Swal.fire({
      title:"Please enter a search term",
      icon:'warning',
      showConfirmButton:true,
    })
  } else {
    window.location.href = `/?search=${searchInput}`;
  }
});

