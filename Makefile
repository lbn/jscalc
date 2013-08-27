REPORTER=list

test:
	mocha --reporter $(REPORTER)
.PHONY: test
