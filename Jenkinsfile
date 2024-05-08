node {
    withCredentials([[$class: 'UsernamePasswordMultiBinding',
        credentialsId: 'coachcoach-docker-username',
        usernameVariable: 'DOCKER_USER_ID',
        passwordVariable: 'DOCKER_USER_PASSWORD'
    ]]) {
        stage('Pull') {
            git branch: 'main', credentialsId: 'github-username-token-credential', url: 'https://github.com/COACH-COACH/Front-End.git'
        }

        stage('Build') {
            sh 'yes | sudo docker image prune -a'
            sh "sudo docker build --no-cache -t vue-server --platform linux/amd64 --build-arg VUE_APP_API_URL=http://3.39.168.72:8080 ./coach-coach"
        }

        stage('Tag') {
            sh 'sudo docker tag vue-server \${DOCKER_USER_ID}/vue-server:\${BUILD_NUMBER}'
        }
        
       	stage('Push') {
            sh 'sudo docker login -u \$DOCKER_USER_ID -p \$DOCKER_USER_PASSWORD'
            sh 'sudo docker push \${DOCKER_USER_ID}/vue-server:\${BUILD_NUMBER}'      	
       	}

        stage('Deploy') {
            sshagent(credentials: ['ec2-springboot-server-ssh']) {
                sh 'ssh -o StrictHostKeyChecking=no ubuntu@3.39.168.72 "sudo docker rm -f docker-vue"'
                sh 'ssh -o StrictHostKeyChecking=no ubuntu@3.39.168.72 "sudo docker run --name docker-vue -e TZ=Asia/Seoul -p 8081:80 -d -t \${DOCKER_USER_ID}/vue-server:\${BUILD_NUMBER}"'
            }
        }
        
        stage('Cleaning Up') {
            sh 'sudo docker system prune --all --volumes --force'
        }
    }
}
