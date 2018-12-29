var ConvertLib = artifacts.require('./ConvertLib.sol')
var Invest = artifacts.require('./Invest.sol')

module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, Invest)
  deployer.deploy(Invest)
}
