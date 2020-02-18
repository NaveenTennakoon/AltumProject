Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796'

let selling = {}
ordersRef.once("value").then(function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    // Getting the total of sold items each
    for (let key in Object.keys(childSnapshot.val().Products)) {
      if (!selling[Object.keys(childSnapshot.val().Products)[key]]) {
        selling[Object.keys(childSnapshot.val().Products)[key]] = 0
      }
      selling[Object.keys(childSnapshot.val().Products)[key]] += parseInt(Object.values(childSnapshot.val().Products)[key])
    }
  })
}).then(() => {
  let sellKeys = []
  for (let key in selling) {
    sellKeys[sellKeys.length] = key
  }
  let sellValues = []
  for (let i = 0; i < sellKeys.length; i++) {
    sellValues[sellValues.length] = selling[sellKeys[i]]
  }
  // Sort and select the top 3 sold items
  let sortedValues = sellValues.sort(sortNumber)
  document.getElementById("best1").innerText = " " + sellKeys[0]
  document.getElementById("best2").innerText = " " + sellKeys[1]
  document.getElementById("best3").innerText = " " + sellKeys[2]

  function sortNumber(a, b) {
    return b - a
  }

  // Create the pie chart
  let ctp = document.getElementById("myPieChart")
  let myPieChart = new Chart(ctp, {
    type: 'doughnut',
    data: {
      labels: Object.keys(selling),
      datasets: [{
        data: [sortedValues[0], sortedValues[1], sortedValues[2]],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  })
})
