
install-back:
	cp back/.env.sample back/.env
	cd back && npm i && cd ..

install-front:
	cp front/.env.sample front/.env
	cd front && npm i && cd ..

install-contracts:
	mkdir -p front/src/contracts/generated
	cp front/src/contracts/defaultTokenDictionary.json \
		front/src/contracts/generated/tokenAddressDictionary.json

install-limiter:	
	cp limiter-service/.env.sample limiter-service/.env
	cd limiter-service; cargo build

setup-githooks:
	git config core.hooksPath .githooks

install:
	make install-back
	make install-front
	make install-contracts
	make install-limiter
	make setup-githooks
