/**
 * Do not modify this file unless you have too
 * This file has UI handlers.
 */
// eslint-disable-next-line no-unused-vars
function connect() {
  $('#connectButton').prop('disabled', true);
  var computation_id = $('#computation_id').val();
  var party_count = parseInt($('#count').val());

  if (isNaN(party_count)) {
    $('#output').append('<p class="error">Party count must be a valid number!</p>');
    $('#connectButton').prop('disabled', false);
  } else {
    var options = { party_count: party_count};
    options.onError = function (error) {
      $('#output').append('<p class="error">'+error+'</p>');
    };
    options.onConnect = function () {
      $('#button').attr('disabled', false);
      $('#output').append('<p>All parties Connected!</p>');
    };

    var hostname = window.location.hostname.trim();
    var port = window.location.port;
    if (port == null || port === '') {
      port = '80';
    }
    if (!(hostname.startsWith('http://') || hostname.startsWith('https://'))) {
      hostname = 'http://' + hostname;
    }
    if (hostname.endsWith('/')) {
      hostname = hostname.substring(0, hostname.length-1);
    }
    if (hostname.indexOf(':') > -1 && hostname.lastIndexOf(':') > hostname.indexOf(':')) {
      hostname = hostname.substring(0, hostname.lastIndexOf(':'));
    }

    hostname = hostname + ':' + port;

    // eslint-disable-next-line no-undef
    mpc.connect(hostname, computation_id, options);
  }
}

// eslint-disable-next-line no-unused-vars
function submit() {
  var arr = JSON.parse(document.getElementById('inputText').value);

  // Ensure array has only numbers
  for (var i = 0; i < arr.length; i++) {
    if (isNaN(arr[i])) {
      $('#output').append('<p class="error">Please input an array of valid numbers!</p>');
      return;
    } else if (100 < arr[i] || arr[i] < 0 || arr[i] !== Math.floor(arr[i])) {
      $('#output').append('<p class="error">Please input an array of whole numbers between 0 and 100!</p>');
      return;
    }
  }

  // Ensure array length is a power of 2
  var lg = arr.length;
  while (lg > 1) {
    if (lg % 2 !== 0) {
      $('#output').append('<p class="error">Input array length must be a power of 2!</p>');
      return;
    }

    lg = lg / 2;
  }

  // Disable UI controls
  $('#button').attr('disabled', true);
  $('#output').append('<p>Starting...</p>');

  // eslint-disable-next-line no-undef
  var promise = mpc.compute(arr);
  promise.then(handleResult);
}

function handleResult(result) {
  $('#output').append('<p>Result is: ' + result + '</p>');
  $('#button').attr('disabled', false);
}
