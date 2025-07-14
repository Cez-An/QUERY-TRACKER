// function openPDFModal(pdfUrl) {
//   const viewerContainer = document.getElementById('pdfViewerContainer');
//   const viewer = document.getElementById('pdfViewer');

//   viewer.src = pdfUrl;
//   viewerContainer.style.display = 'block';
// }

// function closePDFModal() {
//   const viewerContainer = document.getElementById('pdfViewerContainer');
//   const viewer = document.getElementById('pdfViewer');

//   viewer.src = ''; // Stop loading the PDF
//   viewerContainer.style.display = 'none';
// }

// document.getElementById('closePdfBtn').addEventListener('click', closePDFModal);

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

function toggleView() {
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

function openPDFModal(url) {
  const modal = document.getElementById("pdfViewerContainer");
  const iframe = document.getElementById("pdfViewer");
  modal.style.display = "block";
  iframe.src = url;
}

document.getElementById("closePdfBtn").onclick = function () {
  document.getElementById("pdfViewerContainer").style.display = "none";
  document.getElementById("pdfViewer").src = "";
};

function handleFileChange(index) {
  const input = document.getElementById(`pdfInput-${index}`);
  const display = document.getElementById(`selectedFile-${index}`);

  if (input.files.length > 0) {
    display.textContent = `Selected: ${input.files[0].name}`;
  } else {
    display.textContent = '';
  }
}

