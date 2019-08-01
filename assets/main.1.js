$(function() {
    var client = ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '120px' });
    client.get('ticket').then(
      function(data) {
          var phoneNumber = data.ticket.requester.identities[1].value;
          console.log("-----------------")
          console.log(phoneNumber)
          requestUserInfo(client, phoneNumber);
      }
    );
  });
  
  function requestUserInfo(client, phoneNumber) {
    phoneNumber = phoneNumber.replace('+','%2B')
    var settings = {
      url: `http://0.0.0.0:3000/msn?fullmsn=${phoneNumber}`,
      // url: '/api/v2/users/' + id + '.json',
      cors: true,
      type:'GET',
      dataType: 'json',
    };
  
    client.request(settings).then(
      function(data) {
        showInfo(data);
      },
      function(response) {
        showError(response);
      }
    );
  }
  
  function showInfo(data) {

    console.log('>>>>>>>>>>>>>>>>>showInfo')
    console.log(data)

    data = data[0]

    var requester_data = {
    'first_name': data['First Name'],
    'last_name': data['Last Name'],
    'date_joined': data['Date Joined'],
    'phone_number': '+61' + data['Phone Number'] ,
    'customer_ID' : data['Customer ID'],
    'Address' : data['Address'],
    'Email': data['Email'],
    'DOB': data['DOB'],
    'City': data['City'],
    'postal_code': data['Postal Code'],
    'plan_amount': '$' + data['Plan Amount'],
    'total_monthly_bill': '$'+ data['Total Monthly Bill'],
    'occupation':  data['Occupation']
    };
    var source = $("#requester-template").html();
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    $("#content").html(html);
  }
  
  function showError(response) {
    var error_data = {
      'status': response.status,
      'statusText': response.statusText
    };
    var source = $("#error-template").html();
    var template = Handlebars.compile(source);
    var html = template(error_data);
    $("#content").html(html);
  }
  
  function formatDate(date) {
    var cdate = new Date(date);
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
  }