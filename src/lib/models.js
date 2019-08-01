export default {
  "user": {
    "_id": "3",
    "name": "user",
    "label": "User",
    "labelPlural": "Users",
    "endpoints": {
        "list": "/v1/users",
    },
    "fields": {
      "name": {
          "type": "Text",
          "label": "Name",
          "required": true
      },
      "email": {
          "type": "Text",
          "label": "E-mail"
      },
      "status": {
          "type": "Text",
          "label": "Status"
      },
      "dealershipId": {
          "type": "RelateOne",
          "label": "Dealership",
          "relatedModel": "dealership",
          "relatedField": "_id"
      },
      "dealershipRole": {
          "type": "Text",
          "label": "Dealership Role"
      }
    },
  }
};
