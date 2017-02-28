describe('Start robojin', function() {
  it('should always run', function(done) {
    require('../bin/robojin')
    setTimeout(function() {
      done()
    }, 5000)
  })
})
