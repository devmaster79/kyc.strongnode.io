
install:
	git config core.hooksPath .githooks
	cp front/.env.sample front/.env
	cp front/src/contracts/defaultTokenDictionary.json front/src/contracts/generated/tokenAddressDictionary.json
	cp back/.env.sample back/.env
	cd front && npm i && cd ..
	cd back && npm i && cd ..
	cd blockchain && npm i && cd ..
	
