const dnd = document.getElementById("dnd");
const predictButton = document.getElementById("predict");
let uploadImage = document.getElementById("upload");
const pos = document.getElementById("pos");
const neg = document.getElementById("neg");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
  dnd.addEventListener(
    eventName,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  )
);

dnd.addEventListener(
  "drop",
  (e) => {
    let file = e.dataTransfer.files;
    previewFile(file);
  },
  false
);

const previewFile = (file) => {
  let reader = new FileReader();
  reader.readAsDataURL(file[0]);
  reader.onloadend = () => {
    uploadImage.src = reader.result;
    uploadImage.style.width = "50px";
  };
};

predictButton.addEventListener("click", async (e) => {
  await makePrediction();
});

const loadModel = async () => {
  const model = await tf.loadLayersModel(
    "https://raw.githubusercontent.com/SubHodH-K-N/FYP/main/model/model.json"
  );
  return model;
};

const makePrediction = async () => {
  const model = await loadModel();

  let tensor = tf.browser
    .fromPixels(uploadImage)
    .resizeNearestNeighbor([50, 50]) // change the image size here
    .div(tf.scalar(255.0))
    .expandDims();

  let pred = await model.predict(tensor).data();

  pos.innerHTML = `IDC Positive (1) : ${Math.round(pred[1] * 100).toFixed(2)}%`;
  neg.innerHTML = `IDC Negative (0) :${Math.round(pred[0] * 100).toFixed(2)}%`;
};
