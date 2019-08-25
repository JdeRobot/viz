#include "communicator.hpp"

namespace Comm {

Communicator::Communicator(Config::Properties config){
	this->config = config;
	
}


Communicator::~Communicator(){
}


Config::Properties 
Communicator::getConfig(){
	return this->config;
}



}
