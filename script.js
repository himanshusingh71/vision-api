$(document).ready(function () {
  $("#userQuestions").val("");
  let encryptedMessage = "Ehduhu vn-yBfu0wr79bxUo9OFGdTFW3EoenIMxqkwaXotNFSuzFR8mNno";
  const shift = 3;
    $("#run").click(function(){
        let jsonData = {
            model: "gpt-4-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: $("#userQuestions").val() == "" ? "Explain what you understand from the image." : $("#userQuestions").val(),
                  },
                  {
                    type: "image_url",
                    image_url:
                     {
                      "url": $("#base64stuff").val()
                     }
                  },
                ],
              },
            ],
            max_tokens: 50,
          };
        let requestData = JSON.stringify(jsonData);
    $.ajax({
      url: "https://api.openai.com/v1/chat/completions",
      type: "POST",
      data: requestData,
      headers: {
        "Content-Type": "application/json",
        Authorization: caesarCipher(encryptedMessage, shift, false),
      },
      data: requestData,
      beforeSend: function(){
        $("#answers").html("<i class='myloader fa fa-circle-o-notch fa-spin' style='font-size:500%'></i>")
        },
      success: function (response) {
        // console.log("POST request successful:", response);
        // console.log(response.choices[0]);
        let answer = response.choices[0].message.content;
        $("#answers").text(answer);
      },
      error: function (xhr, status, error) {
        console.error("POST request failed:", error);
        $("#answers").html("<h1> Something , went wrong!");
      },
    });});

    $("#fileInput").change(function(){
        console.log("File selected!");
        $("#run").css("display","inline");
        var selectedFile = this.files[0];
        $("#fileName").text("Selected file: " + selectedFile.name);
        if (selectedFile) {
            var reader = new FileReader();
            reader.onload = function() {
                var base64String = reader.result;
                $("#base64stuff").val(base64String);
                console.log($("#base64stuff").val());
            };
            reader.readAsDataURL(selectedFile);
        }
       
    });
    
  });


  // when a file gets selected , this gets triggered
function inputFile(){
    console.log("hello");
    document.getElementById("fileInput").click();
}

function getImageData(){
    console.log("getting image data");
    return "f'data:image/jpeg;base64,'" + $("#base64stuff").val();
}


function caesarCipher(message, shift, encrypt = true) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const messageUpperCase = message.toUpperCase();
  let result = '';

  for (let i = 0; i < message.length; i++) {
    const char = messageUpperCase[i];
    const isUpperCase = message[i] === char;

    if (alphabet.includes(char)) {
      const currentIndex = alphabet.indexOf(char);
      let newIndex;

      if (encrypt) {
        newIndex = (currentIndex + shift) % 26;
      } else {
        // Handle negative shifts
        newIndex = (currentIndex - shift + 26) % 26;
      }

      result += isUpperCase ? alphabet[newIndex] : alphabet[newIndex].toLowerCase();
    } else {
      result += message[i];
    }
  }

  return result;
}
