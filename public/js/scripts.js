function toggleView() { // Toggle between card and table view
  
  const toggleBtn = document.getElementById("toggleMode");
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

function handleFileChange(index) {
  const input = document.getElementById(`pdfInput-${index}`);
  const display = document.getElementById(`selectedFile-${index}`);
  if (input.files.length > 0) {
    display.textContent = `Selected: ${input.files[0].name}`;
  } else {
    display.textContent = '';
  }
}

function openPDFModal(pdfUrl) {
  const viewerContainer = document.getElementById("pdfViewerContainer");
  const viewer = document.getElementById("pdfViewer");
  viewer.src = pdfUrl;
  viewerContainer.style.display = "block";
}

function closePDFModal() {
  const viewerContainer = document.getElementById("pdfViewerContainer");
  const viewer = document.getElementById("pdfViewer");
  viewer.src = ""; // Clear PDF
  viewerContainer.style.display = "none";
}

document.getElementById("closePdfBtn").addEventListener("click", closePDFModal);