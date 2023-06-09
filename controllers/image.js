const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "cbed232564d34a06805122d75e32337a",
});

const handleApiCall = (req, res) => {
  console.log("entering api call");
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      console.log("entering api then");
      res.json(data);
    })
    .catch((err) => res.status(400).json("unable to work with predict api"));
  console.log("exiting api call");
};

const handleApiCallNode = (req, res) => {
  console.log("entering api node");
  console.log(req.body);

  const IMAGE_URL = req.body.input;
  console.log("url = ", IMAGE_URL);

  const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

  const stub = ClarifaiStub.grpc();

  // This will be used by every Clarifai endpoint call
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + "cbed232564d34a06805122d75e32337a");

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: "bobgoblin",
        app_id: "face-recognition-test",
      },
      model_id: "face-detection",
      // version_id: "6dc7e46bc9124c5c8824be4822abe105",  // This is optional. Defaults to the latest model version
      inputs: [{ data: { image: { url: IMAGE_URL } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          "Post model outputs failed, status: " + response.status.description
        );
      }
      console.log(response);
      res.json(response);
      // Since we have one input, one output will exist here.
      //   const output = response.outputs[0];

      //   console.log("Predicted concepts:");
      //   for (const concept of output.data.concepts) {
      //     console.log(concept.name + " " + concept.value);
      //   }
    }
  );
};
//--------------- Old version    -------------------------------

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
  //   let found = false;

  //   database.users.forEach((user) => {
  //     if (user.id === id) {
  //       found = true;
  //       user.entries++;
  //       return res.json(user.entries);
  //     }
  //   });
  //   if (!found) {
  //     res.status(400).json("no such user");
  //   }
};

module.exports = {
  handleImage,
  handleApiCall,
  handleApiCallNode,
};
