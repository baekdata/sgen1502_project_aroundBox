#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>

#include <jni.h>
#include "klt2000_kma_KLT2000JNI.h"
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
JNIEXPORT jstring JNICALL Java_klt2000_kma_KLT2000JNI_getstems
	(JNIEnv *env, jobject obj, jstring str)
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
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_getstems2
	(JNIEnv * env, jobject obj, jstring str, jobjectArray keywords)
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
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_open_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	if (open_HAM_index(&mode, NULL, "C:\\Tmp\\test\\hdic\\KLT2000.ini")) {
        printf("Initialize error -- open_HAM_index()\n");
		return 1;
	} else return 0;
}

/*
 * Class:     KLT2000JNI
 * Method:    close_HAM_index
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_klt2000_kma_KLT2000JNI_close_1HAM_1index
  (JNIEnv *env, jobject obj)
{
	close_HAM_index(&mode);		// HAM is not used any more
}

/*
 * Class:     KLT2000JNI
 * Method:    get_stems
 * Signature: (Ljava/lang/String;)Ljava/lang/String;
 */
JNIEXPORT jstring JNICALL Java_klt2000_kma_KLT2000JNI_get_1stems
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
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_get_1stems2
  (JNIEnv *env, jobject obj, jstring str, jobjectArray keywords)
{
	unsigned char sent[SENTSIZE];	/* input word or sentence */
	int i, n;	/* number of terms */
	unsigned char *term[MAXKEYWORDS];	/* extracted keywords */

	// String을 cpp 형식의 char * 로 변환
	jbyteArray2cstr2(env, javaGetBytes(env, str), (char*)sent, SENTSIZE);
	n = get_stems(sent, term, &mode);

	for(i = 0; i < n; i++) {	// term[i]에 Term 저장
		jstring iArray = javaNewString(env, cstr2jbyteArray(env, (char *)term[i]));
		(*env)->SetObjectArrayElement(env, keywords, i, iArray);
	}

	return n;	// number of terms
}

/* 입력 파일 전체를 memory로 load */
unsigned char *load_text(fp)
FILE *fp;
{
	long n;
	unsigned char *p;

	fseek(fp, 0L, 2);
	n = ftell(fp);	/* n: byte size of file 'fp' */

	fseek(fp, 0L, 0);
	p = (unsigned char *) malloc(n+1);	/* memory allocation */
	if (p == NULL) return NULL;

	fread(p, sizeof(unsigned char), n, fp);	/* read 'fp' to 'p' */
	*(p+n) = '\0';

	return p;
}

/* 추출된 용어 출력 */
void put_terms(fp, term, n, ts)
FILE *fp;
HAM_TERMLIST term[];/* 추출된 용어들의 정보 테이블 */
int n;				/* 추출된 용어 개수 */
unsigned char ts[];	/* 용어들이 NULL 문자 '\0'으로 구분되어 저장되어 있는 memory pool */
		/* ts[] --> "term1<null>term2<null>term3<null>...termN<null>" */
		/* term[i].offset --> 용어 i의 ts[] 저장 위치를 가리키는 정수 */
{
	int i, j, nlocs;

	fprintf(fp, "----------------------------------------------------------------------\n");
	fprintf(fp, " No: Freq  Score  Term\t\t Loc1\t Loc2\t Loc3\t Loc4\t Loc5\n");
	fprintf(fp, "----------------------------------------------------------------------\n");

	for (i = 0; i < n; i++) {
		fprintf(fp, "%3d:%5u %6u  %s", i+1,
			term[i].tf,			/* 용어의 빈도수 */
			term[i].score,		/* 용어의 가중치 */
			ts+term[i].offset);	/* ts+term[i].offset : 용어 스트링 */

			if (strlen(ts+term[i].offset) < 6) fprintf(fp, "\t");	/* 열 맞춤 */

		nlocs = (term[i].tf > MAX_LOCS_PER_TERM ? MAX_LOCS_PER_TERM : term[i].tf);
		for (j = 0; j < nlocs; j++)	/* 용어의 위치정보 최대 MAX_LOCS_PER_TERM 개 */
			fprintf(fp, "\t%5u", term[i].loc[j]);
		fprintf(fp, "\n");
	}

	fprintf(fp, "----------------------------------------------------------------------\n");
}

/*========================== Global Variable ===========================*/
HAM_TERMLIST Term[MAX_TERMS_DOC];	/* extracted terms */
HAM_TERMMEMORY TM;	/* termtext.h: memories needed for term extraction */
/*======================================================================*/

/*
 * Class:     klt2000_kma_KLT2000JNI
 * Method:    get_terms_file
 * Signature: (Ljava/lang/String;Ljava/lang/String;)I
 */
JNIEXPORT jint JNICALL Java_klt2000_kma_KLT2000JNI_get_1terms_1file
  (JNIEnv *env, jobject obj, jstring input_file, jstring output_file)
{
	unsigned char *text;	/* input text: 입력 파일 전체 */
	unsigned char fname[BUFSIZ];	/* input word or sentence */
	FILE *fpin, *fpout;
	int n, n2=0;	/* number of terms */

	// String을 cpp 형식의 char * 로 변환
	jbyteArray2cstr2(env, javaGetBytes(env, input_file), (char*)fname, SENTSIZE);
	fpin = fopen(fname, "r");
	if (fpin == NULL) return -1;
	jbyteArray2cstr2(env, javaGetBytes(env, output_file), (char*)fname, SENTSIZE);
	fpout= fopen(fname, "w");
	if (fpin == NULL) return -1;

	if ((text=load_text(fpin)) == NULL)	/* [주의] 'fpin'은 "rb"로 open */
		return -1;	/* text file --> 'text' */
	n = get_terms_text(text, Term, &TM, &mode, n2, 3, 1);
	/*------------------------------------------------------------------------
		- 다섯번째 인자 -- 0/n/-n(최대로 추출되는 용어수)
			n: 최대 추출 용어수, -n: 빈도 n이상(or n 퍼센트), 0: 모든 용어 추출
			[참고] n개 선택 기준: sortflag(소팅 방식)에 따라 '가중치' or '소팅 옵션'
			  - sortflag가 양수 1/2/3/4 -- 가중치 순으로 n개 선택
			  - sortflag가 음수 -1/-2/-3/-4 -- 소팅 방식에 따라 소팅 후 n개 선택
			[참고] n <= -10 이면, -n 퍼센트만큼 용어수를 출력함.

		- 여섯번째 인자 -- 0/1/2/3/4(소팅 방식)
			0: 소팅 안함, 1: '가나다'순, 2: 빈도순, 3: 가중치, 4: 어절위치
			[참고] n개 선택 기준을 '소팅 방식'에 따라 선택하려면 음수로 줌

		- 마지막 인자 -- 0/1(어절위치 numbering 방식)
			0: 어절순서로, 1: 문장별로 100부터 시작
	========================================================================*/

	put_terms(fpout, Term, n, TM.memTermString);

	free(text);	/* malloc() in 'load_text()' */
	fclose(fpin); fclose(fpout);

	return 0;
}
