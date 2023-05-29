sap.ui.define([
	"./HTTPService"
], function (HTTPService) {
	"use strict";

	var RepoService = HTTPService.extend("pwc.portal.eval.ClubEvaluations.service.RepoService", {

		constructor: function () {},
		uploadFile: function (file, club_dms_id) {
			var form = new FormData();
			//		
			var clean = file;
			var newName = clean.name.replace(/[^\w\s.,:{}\u0600-\u06FF]+/g, '');
			// const updatedClean = {
			// 	lastModified: clean.lastModified,
			// 	lastModifiedDate: clean.lastModifiedDate,
			// 	name: newName, // update the name property with the new value
			// 	size: clean.size,
			// 	type: clean.type,
			// 	webkitRelativePath: clean.webkitRelativePath

			// };

			//console.log(updatedClean);
			//
			var sNewFileName = Date.now() + "." + newName.split(".").at(-1);
			form.append("datafile", file);
			form.append("cmisaction", "createDocument");
			form.append("propertyId[0]", "cmis:objectTypeId");
			form.append("propertyValue[0]", "cmis:document");
			form.append("propertyId[1]", "cmis:name");

			var currentdate = new Date();
			var datetime = currentdate.getDate() + "" + (currentdate.getMonth() + 1) + "" + currentdate.getFullYear() + "" +
				currentdate.getHours() + "" + currentdate.getMinutes() + "" + currentdate.getSeconds();
			var filenameprep = file.name.split('.');
			// var filename = datetime;
			// var fileext = filenameprep[1];
			// var sNewFileName = filename + '.' + fileext;

			var actualfilename = file.name;
			var pathdms = club_dms_id + "/Evaluation" + "/" + sNewFileName;

			//Add the actualfilename to the get 
			//Add the sNewFileName to the set

			jQuery.ajax({
				url: "/portal/portal/portal_gen/DMSMapping/dmsmapping.xsjs" + "?val1=" + sNewFileName + "&val2=" + newName + "&val3=" +
					pathdms,
				method: "GET",
				success: function (response) {},
				error: function (e) {}

			});

			form.append("propertyValue[1]", sNewFileName);
			return this.getRepoId().then(function (ReposId) {
				return this.http(club_dms_id + "/Evaluation").post(false, form);
				return club_dms_id + "/Evaluation" + "/" + sNewFileName;
			}.bind(this));

		},

		createfolder: function (foldername, currentroot) {
			var form = new FormData();
			form.append("cmisaction", "createFolder");
			form.append("propertyId[0]", "cmis:objectTypeId");
			form.append("propertyValue[0]", "cmis:folder");
			form.append("propertyId[1]", "cmis:name");
			form.append("propertyValue[1]", foldername);
			return this.getRepoId().then(function (ReposId) {
				return this.http(currentroot).post(false, form);
			}.bind(this));
		},
		deleteFile: function (name, root) {
			var form = new FormData();
			form.append("cmisaction", "delete");
			return this.getRepoId().then(function (ReposId) {
				return this.http(root + '/' + name).post(false, form);
			}.bind(this));
		},
		getFiles: function () {
			return this.getRepoId().then(function (ReposId) {
				return this.http("/DMSservice/cmis/json/" + ReposId + "/root/").get();
			}.bind(this));
		},
		getFolder: function (Foldername) {
			return this.getRepoId().then(function (ReposId) {
				return this.http("/DMSservice/cmis/json/" + ReposId + "/root/" + Foldername).get();

			}.bind(this));
		},
		getRepoId: function () {
			if (this.RepoId) {
				return Promise.resolve(this.RepoId);
			}
			return this.getRepoInfo().then(function (info) {
				for (var field in info) {
					this.ReposId = info[field].repositoryId;
					break;
				}

				return this.ReposId;
			}.bind(this));
		},
		getRepoInfo: function () {
			return this.http("/DMSservice/cmis/json").get();
		}
	});
	return new RepoService();
});