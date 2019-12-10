 $(document).ready(function () {

  //Add Patient Function
  $('.addSubmitBtn').click(function (event) {
    event.preventDefault();
    const surname = $('#surname').val().trim();
    const othername = $('#othername').val().trim();
    const emailaddress = $('#emailaddress').val().trim();
    const dob = $('#dob').val().trim();
    const phonenumber = $('#phonenumber').val().trim();
    const presentaddress = $('#presentaddress').val().trim();
    const permanentaddress = $('#permanentaddress').val().trim();
    const cardnumber = $('#cardnumber').val().trim();        //Trim is added to ensure that empty space cannot be submitted


    //Check if user input is empty

    if (!surname || !othername || !emailaddress || !dob || !phonenumber || !presentaddress || !permanentaddress || !cardnumber) {
      $('.addMessage').html('Kindly fill in all fields');
      return;
    }

    //Make get request to check if the user already exist

    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/patients?cardnumber=${cardnumber}`,
      data: {
        cardnumber,
      },
      beforeSend: function () {
        $('.addMessage').html('Loading....');
      },
      success: function (response) {
        if (response.length) {
          $('.addMessage').html('Patient already exist');
        } else {
          //Submit the user data if the user does not exist
          $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/patients',
            data: {
              surname,
              othername,
              emailaddress,
              dob,
              phonenumber,
              presentaddress,
              permanentaddress,
              cardnumber,
            },
            beforeSend: function () {
              $('.addMessage').html('Loading....');
            },
            success: function () {
              $('.addMessage').html('Patient Added Successfully');
               $('#surname').val("");
             $('#othername').val("");
              $('#emailaddress').val("");
               $('#dob').val("");
              $('#phonenumber').val("");
              $('#presentaddress').val("");
              $('#permanentaddress').val("");
              $('#cardnumber').val("");   //This is done to ensure that the form returns empty after successfull submission
            },
          });
        }
      },
    });
  });
  //Login Function
  $('.loginSubmitBtn').click(function (event) {
    event.preventDefault();
    const passwordLogin = $('#passwordLogin').val();
    const emailLogin = $('#emailLogin').val();

    if (!passwordLogin || !emailLogin) {
      $('.regMessage').html('Kindly fill in all fields');
      return;
    }
    //Check if the user is in the database
    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/users?email=${emailLogin}&password=${passwordLogin}`,
      data: {
        email: emailLogin,
        password: passwordLogin,
      },
      beforeSend: function () {
        $('.regMessage').html('Loading....');
      },
      success: function (response) {
        if (response.length) {
          $('.regMessage').html('Login sucessful');
          $('.checkLogin').html('You are logged in');
          localStorage.setItem('email', emailLogin);
          //redirect to home page if the login is successfull
          window.location.assign('admin.html');
        } else {
          $('.regMessage').html('email or password Incorrect');
        }
      },
    });
  });
  



  // Search Function

  $('.searchForm').submit(function () {
    event.preventDefault();
    const searchInput = $('#searchInput').val().trim();
    $('.searchMessage').html(''); //Done so that it removes the error message of the invalid card number


    if (!searchInput) {
      $('.searchMessage').html('Kindly a valid card number');
      return;
    }

    $.ajax({
      method: 'GET',
      url: `http://localhost:3000/patients`,

      success: function (response) {


        if (response.length) {
          const userList = response.filter(function (res) {
            return res.cardnumber === searchInput;
          });
          if (userList.length === 0) {
            return $('.searchMessage').html('patient not found');
          }
          userList.forEach(element => {
            const searchHtml = `<tr>        
           <td>${element.surname}</td>
           <td>${element.othername}</td>
           <td>${element.emailaddress}</td>
           <td>${element.dob}</td>
           <td>${element.phonenumber}</td>
           <td><p data-placement="top" data-toggle="tooltip" title="View"><button class="btn btn-success btn-xs" data-title="view" data-toggle="modal" data-target="#view" data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-pencil">View</span></button></p></td>
  
           <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" data-cardNumber=${element.cardnumber} id=${element.id} ><span class="glyphicon glyphicon-pencil">Edit</span></button></p></td>
  
           <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-trash">Delete</span></button></p></td>
           </tr>
           `;


           $(".outputTable").html(searchHtml) //Used so that it won't be appending same search output multiple times.
          });



        }
      },


    });

  });
  $(document).on('click', "td button", function (e) {
    e.preventDefault();
    if ($(this).data('target') == '#edit') {

      $.ajax({
        method: 'GET',
        url: `http://localhost:3000/patients?cardnumber=${$(this).data('cardnumber')}`,
        success: function (res) {
          
          updateForm(res[0]);
          
        }
      });


    } else if ($(this).data('target') == '#view') {
      $.ajax({
        method: 'GET',
        url: `http://localhost:3000/patients?cardnumber=${$(this).data('cardnumber')}`,
        success: function (res) {
          
          updateView(res[0]);
        }
      });
    } else if($(this).data('target') == '#delete') {
      $("button.delete-info").attr("data-id", $(this).attr('id'))
      
    }

  });

  // Function to update for details
  function updateForm(data) {
    $("#edit").find('input[name="surname"]').val(data.surname);
    $("#edit").find('input[name="othername"]').val(data.othername);
    $("#edit").find('input[name="email"]').val(data.emailaddress);
    $("#edit").find('input[name="dob"]').val(data.dob);
    $("#edit").find('input[name="phonenumber"]').val(data.phonenumber);
    $("#edit").find('input[name="presentaddress"]').val(data.presentaddress);
    $("#edit").find('input[name="permanentaddress"]').val(data.permanentaddress);
    $("#edit").find('button[name="update"]').attr('data-id', data.id);
  }

  $("#edit").find('button[name="update"]').click(function (e) {
    e.preventDefault();
    
    $.ajax({
      url: `http://localhost:3000/patients/${$(this).data('id')}`,
      method: 'PATCH',
      data: $('form[name="update"]').serialize(), // It is used in form controls like <input>, <textarea>, <select> etc. It serializes the form values so that its serialized values can be used in the URL query string while making an AJAX request.
      success: function (params) {
        alert("Patient's information is successfully updated")
        window.location.reload();
      }
    })
  })


  
  function updateView(data) {
    $('#view div[name="cardnumber"]').text(data.cardnumber)
    $('#view div[name="surname"]').text(data.surname)
    $('#view div[name="othername"]').text(data.othername)
    $('#view div[name="emailaddress"]').text(data.emailaddress)
    $('#view div[name="dob"]').text(data.dob)
    $('#view div[name="phonenumber"]').text(data.phonenumber)
    $('#view div[name="presentaddress"]').text(data.presentaddress)
    $('#view div[name="permanentaddress"]').text(data.permanentaddress)
  }
  // function updateForm() {

  // }


  // Show all the data in the database
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/patients`,

    success: function (response) {

      response.forEach(element => {
        $(".outputTableAll").prepend(`<tr>        
         <td>${element.surname}</td>
         <td>${element.othername}</td>
         <td>${element.emailaddress}</td>
         <td>${element.dob}</td>
         <td>${element.phonenumber}</td>
         <td><p data-placement="top" data-toggle="tooltip" title="View"><button class="btn btn-success btn-xs" data-title="view" data-toggle="modal" data-target="#view" data-cardNumber=${element.cardnumber} id=${element.id}><span class="glyphicon glyphicon-pencil">View</span></button></p></td>

         <td><p data-placement="top" data-toggle="tooltip" title="Edit"><button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#edit" data-cardNumber=${element.cardnumber} id=${element.id} ><span class="glyphicon glyphicon-pencil">Edit</span></button></p></td>

         <td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete"  id=${element.id}><span class="glyphicon glyphicon-trash">Delete</span></button></p></td>
         </tr>
         `);
      });




    },


  });
  

  // Function for delete button
  $(".delete-info").click(function (e) {
    e.preventDefault();
    $.ajax({
      url: `http://localhost:3000/patients/${$(this).data("id")}`,
      method: 'DELETE',
      success: function () {
        alert("Patient's record has been deleted");
        window.location.reload();
      }
    });
  });

  });


