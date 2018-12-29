import '../styles/app.css'

import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import InvestArtifact from '../../build/contracts/Invest.json'

const Invest = contract(InvestArtifact)

let accounts
let account
let num

const App = {
  start: function () {
    const self = this

    Invest.setProvider(web3.currentProvider)

    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('账户出现错误')
        return
      }

      if (accs.length === 0) {
        alert("无法获得任何账户，请设置正确的端口")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshBalance()

      document.getElementById('info').style.visibility = "hidden"
      document.getElementById('myAmount').style.display = "none"
      document.getElementById('myWayOfMoney').style.display = "none"
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {
    const self = this

    let meta
    Invest.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      console.log(value.valueOf())
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
      
    }).catch(function (e) {
      console.log(e)
      self.setStatus('无法获得账户金额')
    })
  },


  sendCoin: function () {
    const info = document.getElementById('info')
    let amount
    if(info.style.visibility == "hidden"){
      info.style.visibility = "visible"
      document.getElementById('myAmount').style.display = ""
      document.getElementById('myWayOfMoney').style.display = ""
      document.getElementById('myExpect').style.display = "none"

      num = 1
      amount = parseInt(document.getElementById('expect').value)

      console.log(amount)
      console.log(receiver)
    }
    else {
      num = 0
      amount = parseInt(document.getElementById('amount').value)
    }

    const self = this
    const receiver = document.getElementById('receiver').value

    this.setStatus('请确认交易...')
  
    let meta
    Invest.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(num, receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('交易完成!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('交易失败')
    })

    if (num == 0){
      const plan = document.getElementById('wayOfMoney').value
      Invest.deployed().then(function (instance) {
        meta = instance
        return meta.setPlan(plan, { from: account })
      }).then(function () {
      }).catch(function (e) {
        console.log(e)
      })
    }
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
