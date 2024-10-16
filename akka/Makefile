.PHONY: setup
setup:
	@if [ -f .java_home ]; then \
		export JAVA_HOME=$$(cat .java_home); \
	else \
		JAVA_HOME=$$(cs java --installed | grep "21" | head -n 1 | awk '{print $$4}'); \
		echo $$JAVA_HOME > .java_home; \
	fi;

.PHONY: clean
clean:
	@mvn clean
	@rm .java_home

.PHONY: run
run: setup
	@export JAVA_HOME=$$(cat .java_home) && mvn kalix:runAll

.PHONY: deploy
deploy: setup
	@mvn deploy
