
(function() {

	"use strict";

	var config    = require('nconf');
	var Sequelize = require('sequelize');
	var assert    = require("assert");
	var request = require("request");
	var should = require('should');



	// prepare configurations
	config.file('./config.json');
	var dbconf     = config.get('common').database;
	var dlr_url    = config.get('dlr').dlr_url;
	var _id = config.get('dlr')._id;
	var timeout    = 500000;
	var error = "", response = "", body = "";



	var connection = new Sequelize(dbconf.database, dbconf.username, dbconf.password, {
		host    : dbconf.hostname,
		port    : dbconf.port,
		dialect : 'mysql',
		//sync    : {force: true},
		logging : console.log
	});

	console.log(dbconf);

	var raw_query = function(sql, data, callback) {
		connection.query(sql, null, {raw: true}, data).success(callback);  //connect to db
	};


	describe("DLR Handler", function() {
		this.timeout(timeout);

		it('should update status to 6', function(done) {
			//prepare test
			// connection.query("SELECT max(sms_q_id) as sms_q_id FROM sms s JOIN sms_q q ON (s.sms_id=q.sms_id) WHERE account_id=? LIMIT 1",
			
			raw_query("UPDATE advantage.api_mt_send_q SET dlr_status_id = 32, response = 'xxxx' WHERE id = 1", [], function(res) {

				var _id = 1;
				var status   = 32;
				var response = 'xxxx';

				var path = '/dlr/?id='+_id+'&status='+status+'&response='+response;

				console.log('updated ');
				
				request(dlr_url + path, function(e, r, b){ // get http request
					error = e;
					response = r;
					body = b;

					body.should.equal("ACK");
					response.statusCode.should.equal(200); // 200 = http OK

					setTimeout(function(){
						raw_query("SELECT dlr_status_id, response FROM api_mt_send_q WHERE id = 1", [], function(res){
						
							assert.equal(6, res[0].dlr_status_id); //to verify if equal
							assert.equal('xxxx', res[0].response);
							done();
						});
					}, 4000); //timeout // wait
				});

			});
		});
	});
})();
