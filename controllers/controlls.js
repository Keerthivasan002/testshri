const crypto = require("crypto")
const decryptData = (data) => {
    try {
      const key = Buffer.from(process.env.CRYPTO_KEY, 'utf8');
      const iv = Buffer.from(process.env.CRYPTO_IV, 'utf8');
      const encryptedData = Buffer.from(data, 'base64');
      const decipher = crypto.createDecipheriv(process.env.ALGO, key, iv);
      let decrypt = decipher.update(encryptedData, 'base64', 'utf8');
      decrypt += decipher.final('utf8');
      return decrypt;
    } catch (error) {
      console.log(`Error in decryptData - ${error}`);
    }
  };
  

const encryptData = (input) => {
    try {
        const key = Buffer.from(process.env.CRYPTO_E_KEY, 'utf8');
        const iv = Buffer.from(process.env.CRYPTO_E_IV, 'utf8');
        const cipher = crypto.createCipheriv(process.env.ALGO, key, iv);
        let encrypted = cipher.update(input, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    } catch (error) {
        console.log(`Error in encryptData - ${error}`);
    }
};
const testControll = async (req, res) => {
    try {

        const fixedPayload = {
            "name": "Services",
            "pwd": "998"
        };
        const fetchApi = await fetch(
            `http://cossvr.novactech.in/ServiceGateway/auth`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fixedPayload)
            }
        );
        if (fetchApi) {
            let data = await fetchApi.text()
            const input = req.body;
            if (Object.keys(input).length === 0) {
                return res.send({ status: 400, response: "Invalid Data" })
            }
            const requestId = input.RequestID;
            const requestIdPrefix = requestId.substring(0, requestId.indexOf("_"));
            const modifiedPayload = { ...input, RequestID: requestIdPrefix };
            const encryptInput = await encryptData(JSON.stringify(modifiedPayload))
            const payload = { req: encryptInput }
            const updateInput = await fetch(
                `https://cossvr.novactech.in/ServiceGateway/RaiseMyRequest/DepositStatusUpdation`,
                {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${data}`
                    },
                    body: JSON.stringify(payload)
                }
            )
            const final = await updateInput.text()
            const decrypt = decryptData(final)
            const parsedData = JSON.parse(decrypt);
            if (parsedData.statusCode === "200") {
                return res.send({ status: 200, response: decrypt });

            } else {
                return res.send({ status: 500, response: decrypt });
            }
        }else{
            return res.send("dammal")
        }

    } catch (error) {
        return res.send({ stauts: 800, response: error })
    }
}

const dummyControll = async (req, res) => {
    try {
        let token = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'emilys',
                password: 'emilyspass',
                expiresInMins: 30,
            })
        })
        token = await token.json()
        let user = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.token}`,
            },
        })
        user = await user.json()
        return res.send(user)
    } catch (error) {
        return res.send(error)
    }
}

module.exports = { testControll, dummyControll }