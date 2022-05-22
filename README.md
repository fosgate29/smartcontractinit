# smartcontractinit
Initial files to start a Smart Contract project

Install libs, run lint and check coverage
```
npm install
npm run lint-fix
npm run coverage
```

Truffle tests:
```
truffle development
test
```

Testing using fork from Ganache and mainnet
`ganache-cli --fork https://mainnet.infura.io/v3/{infura_project_id}`
and then in another terminal
`truffle test`

