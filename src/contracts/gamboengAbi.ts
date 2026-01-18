import type { Abi } from "viem";

export const gamboengAbi =  [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"name": "ActorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "ActorStatusChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "lotId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "qty",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "meta",
				"type": "string"
			}
		],
		"name": "LotCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			}
		],
		"name": "RoleGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			}
		],
		"name": "RoleRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newLotId",
				"type": "string"
			}
		],
		"name": "TransferAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			}
		],
		"name": "TransferCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "qty",
				"type": "uint256"
			}
		],
		"name": "TransferProposed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "newLotId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "meta",
				"type": "string"
			}
		],
		"name": "acceptTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "actors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "canLogin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			}
		],
		"name": "cancelTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "lotId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "qty",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "meta",
				"type": "string"
			}
		],
		"name": "createPluckingLot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "finishedCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllActors",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllLotIds",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllTransferIds",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getRolesByActor",
		"outputs": [
			{
				"internalType": "enum GamboengTraceability.Step[]",
				"name": "",
				"type": "uint8[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			}
		],
		"name": "getTransfer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "lotIds",
						"type": "string[]"
					},
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "enum GamboengTraceability.Step",
						"name": "toStep",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "accepted",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "cancelled",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "acceptedAt",
						"type": "uint256"
					}
				],
				"internalType": "struct GamboengTraceability.Transfer",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "grantRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasRole",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lotCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "lots",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "actor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "meta",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "finished",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "transferId",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "lotIds",
				"type": "string[]"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "toStep",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "qty",
				"type": "uint256"
			}
		],
		"name": "proposeTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "step",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "revokeRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "setActor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "lotId",
				"type": "string"
			}
		],
		"name": "traceLot",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "enum GamboengTraceability.Step",
						"name": "step",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "actor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "parentIds",
						"type": "string[]"
					},
					{
						"internalType": "string",
						"name": "meta",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "finished",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct GamboengTraceability.LotView[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "transferCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "transfers",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "enum GamboengTraceability.Step",
				"name": "toStep",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "accepted",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "cancelled",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "acceptedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const satisfies Abi;