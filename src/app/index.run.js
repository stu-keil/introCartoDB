(function() {
  'use strict';

  angular
    .module('introCartoDb')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
