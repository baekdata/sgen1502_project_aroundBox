#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

#include <jni.h>
#include "KLT2000JNI.h"
#include "NativeStringUtil.h"

//  한글 형태소 분석기에 관한 header 파일 
#include "../header/ham-ndx.h"

/* 'KeyMem', 'HamOut' is needed ONLY for THREAD-SAFE running */
unsigned char KeyMem[MAXKEYBYTES];	/* TEMPORARY MEMORY: keyword string */
HAM_MORES HamOut;	/* TEMPORARY MEMORY: morph. analysis result */
HAM_RUNMODE mode;			// running mode of HAM

/*
 * JavaJNI_klt2000_getstems
 * Java로부터 입력 문장을 받아 색인어를 추출하여 Java string으로 리턴하는 함수
 *
 * <parameters>
 * str - Java로부터 전달되는 입력 문장
 * keywords - 추출된 색인어 배열(blank로 구분되어 있음)
 */
JNIEXPORT jstring JNICALL 
Java_KLT2000JNI_getstems(JNIEnv *env, jobject obj, jstring str)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */
	char keywords[SENTSIZE*2];

	if (open_HAM_index(&mode, NULL, "./hdic/klt2000.ini")) {
		printf("Initialize error -- open_HAM_index()\n");
		return NULL;
	}

	jbyteArray2cstr2( env, javaGetBytes(env, str), (char *)sent, SENTSIZE );
//	n = get_stems(sent, term, &mode);
	n = get_stems_TS(sent, term, KeyMem, &HamOut, &mode);	/* thread-safe version of 'get_stems()' */

   if (n >= 1) {
		strcpy(keywords, term[0]);
    } else keywords[0] = '\0';
	for (i=1; i < n; i++) {
//		printf( "%d %s\n", nkeys, keys[i] );
		strcat(keywords," ");
		strcat(keywords, term[i]);
    }
//	printf("%s", keywords);

	close_HAM_index(&mode);	/* HAM is not used any more */

    /* 디폴트 인코딩의 네이티브 스트링 -> 자바 스트링 */
	return javaNewString( env, cstr2jbyteArray(env, keywords) );
}

/*
 * JavaJNI_klt2000_getstems2
 * Java로부터 문장을 받아 색인어 추출기를 이용하여 색인어를 추출하고 이를 Java로 다시 리턴하는 함수
 *
 * <parameters>
 * str - Java로부터 전달되는 문장
 * keywords - 추출된 색인어 배열
 */
JNIEXPORT jint JNICALL
Java_KLT2000JNI_getstems2(JNIEnv * env, jobject obj, jstring str, jobjectArray keywords)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *terms[MAXKEYWORDS];	/* extracted keywords */

    if (open_HAM_index(&mode, NULL, "./hdic/klt2000.ini")) {
		printf("Initialize error -- open_HAM_index()\n");
		return 0;
	}

	// String을 cpp 형식의 char * 로 변환
	jbyteArray2cstr2(env, javaGetBytes(env, str), (char*)sent, SENTSIZE);
	n = get_stems(sent, terms, &mode);

	for(i = 0; i < n; i++) {	// terms[i]에 Term 저장
		jstring iArray = javaNewString(env, cstr2jbyteArray(env, (char *)terms[i]));
		(*env)->SetObjectArrayElement(env, keywords, i, iArray);
	}

	close_HAM_index(&mode);		// HAM is not used any more
	return n;	// number of terms
}

/*
 * Class:     KLT2000JNI
 * Method:    open_HAM_index
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_KLT2000JNI_open_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	printf("Called open_HAM_index().\n");
	if (open_HAM_index(&mode, NULL, "C:\\Tmp\\test\\hdic\\klt2000.ini")) {
        printf("Initialize error -- open_HAM_index()\n");
		return 1;
	} else return 0;
}

/*
 * Class:     KLT2000JNI
 * Method:    close_HAM_index
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_KLT2000JNI_close_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	close_HAM_index(&mode);		// HAM is not used any more
}

/*
 * Class:     KLT2000JNI
 * Method:    get_stems
 * Signature: (Ljava/lang/String;)Ljava/lang/String;
 */
JNIEXPORT jstring JNICALL Java_KLT2000JNI_get_1stems
  (JNIEnv *env, jobject obj, jstring str)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */
	char keywords[SENTSIZE*2];

	jbyteArray2cstr2( env, javaGetBytes(env, str), (char *)sent, SENTSIZE );
//	n = get_stems(sent, term, &mode);
	n = get_stems_TS(sent, term, KeyMem, &HamOut, &mode);	/* thread-safe version of 'get_stems()' */

   if (n >= 1) {
		strcpy(keywords, term[0]);
    } else keywords[0] = '\0';
	for (i=1; i < n; i++) {
		strcat(keywords," ");
		strcat(keywords, term[i]);
	}
	return javaNewString( env, cstr2jbyteArray(env, keywords) );
}

/*
 * Class:     KLT2000JNI
 * Method:    get_stems2
 * Signature: (Ljava/lang/String;[Ljava/lang/String;)I
 */
JNIEXPORT jint JNICALL Java_KLT2000JNI_get_1stems2
  (JNIEnv *env, jobject obj, jstring str, jobjectArray keywords)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *terms[MAXKEYWORDS];	/* extracted keywords */

	// String을 cpp 형식의 char * 로 변환
	jbyteArray2cstr2(env, javaGetBytes(env, str), (char*)sent, SENTSIZE);
	n = get_stems(sent, terms, &mode);

	for(i = 0; i < n; i++) {	// terms[i]에 Term 저장
		jstring iArray = javaNewString(env, cstr2jbyteArray(env, (char *)terms[i]));
		(*env)->SetObjectArrayElement(env, keywords, i, iArray);
	}

	return n;	// number of terms
}
