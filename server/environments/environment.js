'use strickt';

let environment_prod={
	api_port:4000,
	secretkey:"]2ck'j878&re34_4wrdvmn ,m@8}6",
	postgres_user:'postgres',
	postgres_password:'j0$u3p0$79r3$',
	postgres_dbname:'totemroip',
	postgres_ip:'localhost',
	postgres_port:5432,
	system_accesskey:''
};

let environment_dev={
	api_port:4000,
	secretkey:"]2ck'j878&re34_4wrdvmn ,m@8}6",
	postgres_user:'postgres',
	postgres_password:'j0$u3p0$79r3$',
	postgres_dbname:'totemroip',
	postgres_ip:'localhost',
	postgres_port:5432
};

const environment=environment_prod;
module.exports=environment;