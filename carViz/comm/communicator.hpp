#pragma once

#include "../config/properties.hpp"

namespace Comm {

	class Communicator {
	public:
		Communicator(Config::Properties config);
		~Communicator();

		Config::Properties getConfig();


	private:
		Config::Properties config;
	};


} 

