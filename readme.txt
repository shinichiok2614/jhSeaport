Install MacPorts for macOS Monterey v12: https://github.com/macports/macports-base/releases/download/v2.9.3/MacPorts-2.9.3-12-Monterey.pkg
Install git: sudo port install git
Install homebrew: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Install Docker
ssh-keygen -t ed25519 -C "your_email@example.com"
Install zsh: sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
Docker:
	cài đặt JHipster CLI:
		docker run --rm -it -v $(pwd):/app jhipster/jhipster jhipster
		docker run -it -v $(pwd):/app jhipster/jhipster jhipster
			-it: Tùy chọn này bao gồm hai tùy chọn con:
				-i: Giữ cho stdin của container mở ngay cả khi không đính kèm.
					stdin (Standard Input): Đây là luồng đầu vào tiêu chuẩn, được sử dụng để nhận dữ liệu
					stdout (Standard Output): Đây là luồng đầu ra tiêu chuẩn, thường là tới màn hình terminal của bạn.
					stderr (Standard Error)
				-t: Gán một pseudo-TTY cho container, cho phép bạn tương tác với container thông qua terminal.
	Tương tác với container:
		docker run -it jhipster/jhipster bash
Cài jh: npm install -g generator-jhipster
Cài node:
	# installs nvm (Node Version Manager)
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

	# download and install Node.js (you may need to restart the terminal)
	nvm install 20

	# verifies the right Node.js version is in the environment
	node -v # should print `v20.16.0`

	# verifies the right npm version is in the environment
	npm -v # should print `10.8.1`
Cài node: 
	docker pull node:20-alpine
	docker run node:20-alpine node -v
	docker run node:20-alpine npm -v
sửa lỗi nvm không truy cập được:
	nano ~/.zshrc
	thêm các dòng sau vào cuối tệp ~/.zshrc:
		export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
		[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
	source ~/.zshrc
cài java:
	brew install openjdk@21
sửa lỗi java Permission denied:
	sudo chmod -R 755 /Users/admin/Library/Caches/Homebrew
	sudo chown -R $(whoami) /Users/admin/Library/Caches/Homebrew
cấu hình java:
	nano ~/.zshrc
	thêm các dòng sau vào cuối tệp ~/.zshrc:
		export PATH="/usr/local/opt/openjdk@11/bin:$PATH"
	source ~/.zshrc
tạo dự án:
	docker run --rm -it -v $(pwd):/app jhipster/jhipster jhipster
Install Nodejs LTS: https://nodejs.org/en/download/package-manager
chạy MySQL:
	docker-compose -f src/main/docker/mysql.yml up -d
Dockerfile:
	# Use an appropriate base image
	FROM openjdk:17-jdk
	# Set working directory
	WORKDIR /app
	# Copy the application files
	COPY . .
	# Build the application
	RUN ./mvnw package
	# Run the application
	CMD ["java", "-jar", "target/*.jar"]
Tạo Docker Image từ Dockerfile
	docker build -t my-jhipster-app .
chạy App:
	docker-compose -f src/main/docker/app.yml up -d

https://drive.google.com/drive/folders/1WyQLXKh-Cs_e5F_B25_upSlNwfbNDQS_
?
  thông tin xác thực lưu ở đâu: cookie hay session
LỖI:
npm install - chạy đến đây dừng
  comment tất cả <groupId>com.github.eirslett</groupId> trong pom.xml
  ctrl c, xóa 4 eirslett trong pom.xml, ./mvnw, yarn install (hoặc yarn là được), yarn start

yarn add react-modal
npx storybook@latest init
yarn dlx storybook@latest init
yarn v4 mới có dlx

Để cài đặt Yarn v4 (còn được gọi là Yarn Berry) trên macOS
  brew uninstall yarn
  npm uninstall -g yarn
  npm install -g yarn
  yarn set version berry
  yarn --version
  Cấu hình Yarn Berry cho dự án
    touch .yarnrc.yml
  Thêm cấu hình cơ bản vào .yarnrc.yml:
    nodeLinker: node-modules
  Chạy lệnh Yarn trong thư mục gốc của dự án:
    yarn

lỗi yarn v4: The nearest package directory (/Users/pc/Downloads/repo/storybook) doesn't seem to be part of the project declared in /Users/pc.
  trong package.json của dự án chính:  
  {
    "private": true,
    "workspaces": ["Downloads/repo/storybook"]
  }

nano ~/.zshrc
brew uninstall yarn
npm uninstall -g yarn
rm -rf ~/.yvm
rm -rf ~/.config/yarn
rm -rf ~/.yarn
curl -fsSL https://raw.githubusercontent.com/tophat/yvm/master/scripts/install.js | node
  export YVM_DIR=$HOME/.yvm
  [ -r $YVM_DIR/yvm.sh ] && . $YVM_DIR/yvm.sh
source ~/.zshrc
yvm install 1.22.22
yvm use 1.22.22

gỡ bỏ yvm (Yarn Version Manager)
  rm -rf ~/.yvm
  nano /.zshrc
  xóa
    export YVM_DIR=$HOME/.yvm
    [ -r $YVM_DIR/yvm.sh ] && . $YVM_DIR/yvm.sh
  source ~/.zshrc

NODEJS
brew uninstall node
cài nvm
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  source ~/.zshrc
nvm install 20.9.0
nvm use 20.9.0
node -v
npm -v


yarn add vite --dev
yarn storybook 
npx storybook@latest init
  webpack 5


//cap quyen thu muc npm
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
npm install -g generator-jhipster
    npm install -g generator-jhipster@7.1.0     //redux bt, <>redux toolkit
    package.json
    webpack-cli: 4.9.1
    workbox-webpack-plugin: 
    npm install --save-exact history@4.10.1
jhipster info
    Welcome to JHipster v8.6.0
    "webpack": "5.92.1"
    "generator-jhipster": "8.6.0"
    node v20.15.1
    ##### **Environment and Tools**

    java version "21.0.3" 2024-04-16 LTS
    Java(TM) SE Runtime Environment (build 21.0.3+7-LTS-152)
    Java HotSpot(TM) 64-Bit Server VM (build 21.0.3+7-LTS-152, mixed mode, sharing)

    git version 2.41.0

    node: v20.15.1
    npm: 10.7.0

    Docker version 24.0.5, build ced0996


mkdir myApp && cd myApp
  jhipster
  jhipster --version
  8.4.0
  https://www.jhipster.tech/
  domain: modal
  webapp: react->web/rest: controller->service->repository->db

  ./mvnw
  npm run e2e         *** hay

  jhipster heroku

  jhipster jdl ./jdl/sql.jdl --ignore-application
  jhipster jdl ./readme/sql.jdl

ynarxdeiH
y) overwrite
n) do not overwrite
a) overwrite this and all others
r) reload file (experimental)
x) abort
d) show the differences between the old and the new
e) edit file (experimental)
i) ignore, do not overwrite and remember (experimental)
h) Help, list all options

nếu sửa jdl xong mà k chạy được thì xóa database trong mysql đi
  vì liquidbase nó k thể thay đổi table đã tạo

https://devforum.okta.com/t/build-a-photo-gallery-pwa-with-react-spring-boot-and-jhipster/16888

url: jdbc:mysql://localhost:3306/jhSeaPort2?useUnicode=true&characterEncoding=utf8&useSSL=false&useLegacyDatetimeCode=false&createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true
username: root
password: 1111


  ${AnsiColor.GREEN}████████╗${AnsiColor.CYAN} ██╗   ██╗ █████╗ ███╗   ██╗    ███╗   ███╗████████╗ █████╗ 
  ${AnsiColor.GREEN}╚══██╔══╝${AnsiColor.CYAN} ██║   ██║██╔══██╗████╗  ██║    ████╗ ████║╚══██╔══╝██╔══██╗
  ${AnsiColor.GREEN}   ██║   ${AnsiColor.CYAN} ██║   ██║███████║██╔██╗ ██║    ██╔████╔██║   ██║   ███████║
  ${AnsiColor.GREEN}   ██║   ${AnsiColor.CYAN} ██║   ██║██╔══██║██║╚██╗██║    ██║╚██╔╝██║   ██║   ██╔══██║
  ${AnsiColor.GREEN}   ██║   ${AnsiColor.CYAN} ╚██████╔╝██║  ██║██║ ╚████║    ██║ ╚═╝ ██║   ██║   ██║  ██║
  ${AnsiColor.GREEN}   ╚═╝   ${AnsiColor.CYAN}  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝

${AnsiColor.BRIGHT_BLUE}:: JHipster 🤓  :: Running Spring Boot ${spring-boot.version} :: Startup profile(s) ${spring.profiles.active} ::

__/\\\\\\\\\\\\\\\__/\\\________/\\\_____/\\\\\\\\\_____/\\\\\_____/\\\____________/\\\\____________/\\\\__/\\\\\\\\\\\\\\\_____/\\\\\\\\\____        
 _\///////\\\/////__\/\\\_______\/\\\___/\\\\\\\\\\\\\__\/\\\\\\___\/\\\___________\/\\\\\\________/\\\\\\_\///////\\\/////____/\\\\\\\\\\\\\__       
  _______\/\\\_______\/\\\_______\/\\\__/\\\/////////\\\_\/\\\/\\\__\/\\\___________\/\\\//\\\____/\\\//\\\_______\/\\\________/\\\/////////\\\_      
   _______\/\\\_______\/\\\_______\/\\\_\/\\\_______\/\\\_\/\\\//\\\_\/\\\___________\/\\\\///\\\/\\\/_\/\\\_______\/\\\_______\/\\\_______\/\\\_     
    _______\/\\\_______\/\\\_______\/\\\_\/\\\\\\\\\\\\\\\_\/\\\\//\\\\/\\\___________\/\\\__\///\\\/___\/\\\_______\/\\\_______\/\\\\\\\\\\\\\\\_    
     _______\/\\\_______\/\\\_______\/\\\_\/\\\/////////\\\_\/\\\_\//\\\/\\\___________\/\\\____\///_____\/\\\_______\/\\\_______\/\\\/////////\\\_   
      _______\/\\\_______\//\\\______/\\\__\/\\\_______\/\\\_\/\\\__\//\\\\\\___________\/\\\_____________\/\\\_______\/\\\_______\/\\\_______\/\\\_  
       _______\/\\\________\///\\\\\\\\\/___\/\\\_______\/\\\_\/\\\___\//\\\\\___________\/\\\_____________\/\\\_______\/\\\_______\/\\\_______\/\\\_ 
        _______\///___________\/////////_____\///________\///__\///_____\/////____________\///______________\///________\///________\///________\///__


yarn add react-slick slick-carousel
>app.scss
@import "~slick-carousel/slick/slick.css";
@import "~slick-carousel/slick/slick-theme.css";

.jh-navbar {
  background-color: rgb(153, 0, 0);

# Thiết lập JAVA_HOME cho Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export PATH=$JAVA_HOME/bin:$PATH

source ~/.zshrc

./mvnw

Trong IntelliJ IDEA, bạn có thể thực hiện các bước tương tự để chạy ứng dụng JHipster của mình mà không gặp lỗi datasource. Dưới đây là hướng dẫn chi tiết:

  1. Chạy với Spring Profile
  Để chạy ứng dụng với một Spring profile cụ thể trong IntelliJ IDEA:

  Mở phần cấu hình chạy (Run Configuration) bằng cách nhấp vào Run trên thanh menu và chọn Edit Configurations....
  Tạo một cấu hình chạy mới hoặc chỉnh sửa cấu hình hiện tại của bạn.
  Trong phần VM options, thêm -Dspring.profiles.active=dev để thiết lập profile. Ví dụ:
  plaintext
  Copy code
  -Dspring.profiles.active=dev
  2. Thiết lập biến môi trường
  Bạn cũng có thể thiết lập các biến môi trường cần thiết:

  Trong phần cấu hình chạy, tìm và nhấp vào tab Configuration.
  Trong phần Environment variables, thêm các biến môi trường như SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, và SPRING_DATASOURCE_PASSWORD.
  3. Đảm bảo Classpath đúng
  IntelliJ IDEA thường sẽ tự động thiết lập classpath đúng nếu bạn đã import dự án Maven hoặc Gradle. Đảm bảo rằng bạn đã import dự án như một dự án Maven bằng cách:

  Nhấp chuột phải vào file pom.xml và chọn Add as Maven Project.
  Chờ IDEA tải và cấu hình các dependency.
  4. Build dự án
  Đảm bảo rằng dự án của bạn đã được build trước khi chạy:

  Nhấp vào Build trên thanh menu và chọn Build Project hoặc Rebuild Project.
  5. Chạy ứng dụng
  Sau khi thiết lập tất cả các cấu hình trên, bạn có thể chạy ứng dụng bằng cách nhấp vào nút Run (hình tam giác màu xanh) trên thanh công cụ hoặc sử dụng phím tắt Shift + F10.

  Tóm tắt các bước cụ thể
  Mở Run Configuration:

  Run > Edit Configurations...
  Thiết lập Spring Profile:

  Trong tab Configuration, thêm -Dspring.profiles.active=dev vào VM options.
  Thiết lập biến môi trường:

  Trong tab Configuration, thêm biến môi trường cần thiết vào Environment variables.
  Import dự án Maven:

  Nhấp chuột phải vào pom.xml > Add as Maven Project.
  Build dự án:

  Build > Build Project hoặc Rebuild Project.
  Chạy ứng dụng:

  Nhấp vào nút Run hoặc sử dụng phím tắt Shift + F10.
  Với các bước này, bạn sẽ đảm bảo rằng ứng dụng của bạn có đầy đủ các cấu hình và dependency cần thiết để chạy mà không gặp lỗi datasource.


Mở IntelliJ IDEA và vào File -> Project Structure.
Ở phần Project (hoặc Modules nếu bạn đang làm việc với một module cụ thể), chọn Project SDK là JDK 20 (hoặc phiên bản Java 20 mà bạn đã cài đặt).

pom.xml
<properties>
    <maven.compiler.source>20</maven.compiler.source>
    <maven.compiler.target>20</maven.compiler.target>
</properties>


-thêm comment với tài khoản
-trang cá nhân
-liên kết post khi bấm vào tiêu đề
-liên kết trang cá nhân khi bấm vào name
-liên kết create post ở trang cá nhân
-liên kết edit profile ở trang cá nhân
-trang bài viết
-chỉ hiện bài viết success
-1 liên kết person và user ok
-2 nhận dạng person
-trang phân quyền 
-trang duyệt bài của admin


<plugin>
  <groupId>com.github.eirslett</groupId>
  <artifactId>frontend-maven-plugin</artifactId>
  <executions>
      <execution>
          <id>install-node-and-npm</id>
          <goals>
              <goal>install-node-and-npm</goal>
          </goals>
          <configuration>
              <skip>true</skip> <!-- Thêm dòng này để bỏ qua -->
          </configuration>
      </execution>
      <execution>
          <id>npm install</id>
          <goals>
              <goal>npm</goal>
          </goals>
          <configuration>
              <skip>true</skip> <!-- Thêm dòng này để bỏ qua -->
          </configuration>
      </execution>
      <execution>
          <id>webapp build test</id>
          <goals>
              <goal>npm</goal>
          </goals>
          <phase>test</phase>
          <configuration>
              <arguments>run webapp:test</arguments>
              <npmInheritsProxyConfigFromMaven>false</npmInheritsProxyConfigFromMaven>
              <skip>true</skip> <!-- Thêm dòng này để bỏ qua -->
          </configuration>
      </execution>
      <execution>
          <id>webapp build prod</id>
          <goals>
              <goal>npm</goal>
          </goals>
          <phase>generate-resources</phase>
          <configuration>
              <arguments>run webapp:prod</arguments>
              <environmentVariables>
                  <APP_VERSION>${project.version}</APP_VERSION>
              </environmentVariables>
              <npmInheritsProxyConfigFromMaven>false</npmInheritsProxyConfigFromMaven>
              <skip>true</skip> <!-- Thêm dòng này để bỏ qua -->
          </configuration>
      </execution>
  </executions>
</plugin>

websocket

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

./mvnw clean install
yarn add @stomp/stompjs sockjs-client

application.yml
    kafka:
        client:
        dns:
            lookup: use_dns_cache
        bootstrap-servers: ${KAFKA_BROKER_SERVER:localhost}:${KAFKA_BROKER_PORT:9092}
        producer:
        value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
        #transaction-id-prefix: tx.
        properties:
            "[spring.json.type.mapping]": category:com.mycompany.myapp.domain.Category
        consumer:
        value-deserializer: org.apache.kafka.common.serialization.ByteArrayDeserializer
pom.yml
    <dependency>
			<groupId>org.springframework.kafka</groupId>
			<artifactId>spring-kafka</artifactId>
	</dependency>


////////////////////////////////////
nodejs

Cài đặt nvm:
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash 
Thêm nvm vào file cấu hình shell:
    Nếu bạn dùng zsh, thêm vào ~/.zshrc:
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
    Nếu bạn dùng bash, thêm vào ~/.bashrc hoặc ~/.bash_profile:
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
Tải lại file cấu hình shell:
    source ~/.zshrc  # hoặc source ~/.bashrc / ~/.bash_profile tùy theo shell bạn dùng
Cài đặt phiên bản Node.js mong muốn:
    nvm install node  # Cài đặt phiên bản mới nhất
    nvm install 20    # Cài đặt phiên bản 20
Kiểm tra phiên bản Node.js:
    node -v
Với nvm, bạn có thể dễ dàng chuyển đổi giữa các phiên bản Node.js bằng lệnh nvm use <version>.

jhipster docker-compose
Welcome to the JHipster Docker Compose Sub-Generator 🐳


Trong React, cú pháp điều kiện (conditional rendering) được sử dụng để hiển thị các phần tử hoặc component dựa trên điều kiện nhất định.

const MyComponent = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn && <p>Welcome back!</p>}
    </div>
  );
};

const MyComponent = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
};

const MyComponent = ({ isLoggedIn }) => {
  if (isLoggedIn) {
    return <p>Welcome back!</p>;
  } else {
    return <p>Please log in.</p>;
  }
};

const MyComponent = ({ isLoggedIn }) => {
  return (
    <div>
      {(() => {
        if (isLoggedIn) {
          return <p>Welcome back!</p>;
        } else {
          return <p>Please log in.</p>;
        }
      })()}
    </div>
  );
};

const MyComponent = ({ userName }) => {
  return (
    <div>
      <p>Hello, {userName || 'Guest'}!</p>
    </div>
  );
};


https://react-page.github.io/examples/reactadmin#/posts/post1

STREAM song song
List<String> titles = posts.stream() // Tạo một stream từ danh sách posts
              .filter(post -> post.getTitle().startsWith("Title")) // Phép toán trung gian: lọc các bài đăng có tiêu đề bắt đầu bằng "Title"
              .map(Post::getTitle) // Phép toán trung gian: chuyển đổi mỗi post thành tiêu đề của nó
              .collect(Collectors.toList()); // Phép toán kết thúc: thu thập các tiêu đề thành một danh sách

      titles.forEach(System.out::println); // In ra các tiêu đề

