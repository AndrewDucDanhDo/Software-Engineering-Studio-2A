var adder = {
    "gates":[
 
    ],
    "circuit":[
       {
          "type":"x",
          "time":0,
          "targets":[
             3
          ],
          "controls":[
             0,
             1
          ]
       },
       {
          "type":"x",
          "time":1,
          "targets":[
             2
          ],
          "controls":[
             1
          ]
       },
       {
          "type":"x",
          "time":2,
          "targets":[
             2
          ],
          "controls":[
             0
          ]
       }
    ],
    "qubits":4,
    "input":[
       0,
       0,
       0,
       0
    ],
    "version":1
 }

 module.exports = adder;